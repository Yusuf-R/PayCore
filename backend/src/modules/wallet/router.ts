import {Router} from "express";
import {requireAuth} from "../../middleware/auth.js";
import {validate} from "../../middleware/validate.js";
import {accountNumberParamSchema, fundWalletSchema} from "./schema.js";
import {walletController} from "./controller.js";
import {rateLimit} from "../../middleware/rateLimit.js";

export const walletRouter = Router();

walletRouter.use(requireAuth);

walletRouter.get("/me", walletController.getMyWallet);

walletRouter.post("/fund", validate({body: fundWalletSchema}), walletController.fundWallet,);

walletRouter.get("/lookup/:accountNumber",
    rateLimit({
        windowSeconds: 60,
        max: 10,
        keyPrefix: "ratelimit:lookup"
    }),
    validate({params: accountNumberParamSchema}),
    walletController.lookupAccount
);