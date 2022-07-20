import express, { NextFunction, Request, Response } from "express";
import sendEmail from "../05-bll/email-logic";
import sendEmailAfterBuying from "../05-bll/email-logic";

const router = express.Router();

router.post("/sendMail/:mail", async (request: Request, response: Response, next: NextFunction) => {
    try {

        let mail = request.params.mail;
        const info = await sendEmail.sendEmail(mail, "InexPrice");
        response.status(201).json(info);
    }
    catch (err: any) {
        next(err);
    }
});

router.post("/sendMailOrder/:mail", async (request: Request, response: Response, next: NextFunction) => {
    try {

        let mail = request.params.mail;
        var cartItems: any = request.body.cartItems;
        var order = request.body.order;
        const info = await sendEmailAfterBuying.sendEmailAfterBuying(mail, "InexPrice", cartItems, order);
        response.status(201).json(info);
    }
    catch (err: any) {
        next(err);
    }
});

export default router;

