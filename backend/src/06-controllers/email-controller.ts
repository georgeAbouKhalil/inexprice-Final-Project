import express, { NextFunction, Request, Response } from "express";
import sendEmail from "../05-bll/email-logic";
import sendEmailAfterBuying from "../05-bll/email-logic";

const router = express.Router();

router.post("/sendMail/:mail", async (request: Request, response: Response, next: NextFunction) => {
    try {
        
            let mail = request.params.mail;
            // console.log({mail});

            // const info = await sendEmail(mail, "InexPrice", "thanks for submitting your message, we will contact you soon...");
            const info = await sendEmail.sendEmail(mail, "InexPrice");
            console.log(info);

            // const addedCreditCard= await logic.addCreditCard(creditCard);
            response.status(201).json(info);


    }
    catch(err: any) {
        next(err);
    }
});

router.post("/sendMailOrder/:mail", async (request: Request, response: Response, next: NextFunction) => {
    try {
        
            let mail = request.params.mail;
                // var body='<h1>Hello</h1>';
                var cartItems:any = request.body.cartItems;
                var order = request.body.order;

                console.log("request.params.cartItems ", cartItems);
                console.log("request.params.orderDetails ",order);
                
            

            // const info = await sendEmail(mail, "InexPrice", "thanks for submitting your message, we will contact you soon...");
            const info = await sendEmailAfterBuying.sendEmailAfterBuying(mail, "InexPrice",cartItems,order);
            console.log(info);

            // const addedCreditCard= await logic.addCreditCard(creditCard);
            response.status(201).json(info);


    }
    catch(err: any) {
        next(err);
    }
});

export default router;

