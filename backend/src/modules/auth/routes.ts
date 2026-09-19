import {Router} from "express";
import {validate} from "../../middleware/validate.js";
import {
    registerSchema,
    verifyEmailSchema,
    forgotPasswordSchema,
    resetPasswordSchema,
    loginSchema,
} from "./schema.js";
import {authController} from "./controller.js";

export const authRouter = Router();

authRouter.post("/register", validate({body: registerSchema}), authController.register,);

authRouter.post("/verify-email", validate({body: verifyEmailSchema}), authController.verifyEmail,);

authRouter.post("/forgot-password", validate({body: forgotPasswordSchema}), authController.forgotPassword,);

authRouter.post("/reset-password", validate({body: resetPasswordSchema}), authController.resetPassword,);

authRouter.post("/login", validate({ body: loginSchema }), authController.login);

authRouter.post("/refresh", authController.refresh);

authRouter.post("/logout", authController.logout);