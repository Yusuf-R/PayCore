import { Router } from "express";
import { requireAuth } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import { updateProfileSchema } from "./schema.js";
import { userController } from "./controller.js";

export const userRouter = Router();

userRouter.use(requireAuth);

userRouter.patch(
    "/me",
    validate({ body: updateProfileSchema }),
    userController.updateMe,
);