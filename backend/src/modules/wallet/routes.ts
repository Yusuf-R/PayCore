import {Router} from "express";
import {requireAuth} from "../../middleware/auth.js";
import {validate} from "../../middleware/validate.js";
import {fundWalletSchema} from "./schema.js";
import {walletController} from "./controller.js";

export const walletRouter = Router();

walletRouter.use(requireAuth);

walletRouter.get("/me", walletController.getMyWallet);

walletRouter.post("/fund", validate({body: fundWalletSchema}), walletController.fundWallet,);