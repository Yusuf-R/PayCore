import type { Request, Response, NextFunction } from "express";
import { type ZodType, ZodError } from "zod";

interface ValidationSchemas {
    body?: ZodType;
    params?: ZodType;
    query?: ZodType;
}

export function validate(schemas: ValidationSchemas) {
    return (req: Request, res: Response, next: NextFunction): void => {
        try {
            if (schemas.body) {
                req.body = schemas.body.parse(req.body);
            }

            if (schemas.params) {
                req.params = schemas.params.parse(req.params) as typeof req.params;
            }

            if (schemas.query) {
                Object.defineProperty(req, "query", {
                    value: schemas.query.parse(req.query),
                    writable: true,
                    configurable: true,
                });
            }

            next();
        } catch (err) {
            if (err instanceof ZodError) {
                res.status(400).json({
                    error: "Validation failed",
                    details: err.issues.map((issue) => ({
                        path: issue.path.join("."),
                        message: issue.message,
                    })),
                });
                return;
            }
            next(err);
        }
    };
}