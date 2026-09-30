import {Router} from "express";
import {requireAuth} from "../../middleware/auth.js";
import {idempotent} from "../../middleware/idempotent.js";
import {validate} from "../../middleware/validate.js";
import {createTransferSchema} from "./schema.js";
import {transferController} from "./controller.js";

export const transferRouter = Router();

transferRouter.use(requireAuth);

transferRouter.post("/", idempotent("POST /transfers"), validate({body: createTransferSchema}), transferController.create);

transferRouter.get("/", transferController.list);

transferRouter.get("/:id", transferController.getOne);