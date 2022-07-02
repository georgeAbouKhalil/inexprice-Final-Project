import express, { NextFunction, Request, Response } from "express";
import sendEmail from "../05-bll/email-logic";

const router = express.Router();

router.post("/sendMail/:mail", async (request: Request, response: Response, next: NextFunction) => {
    try {
        
let mail = request.params.mail;
    
console.log({mail});

            const info = await sendEmail(mail, "InexPrice", "thanks for submitting your message, we will contact you soon...");
            console.log(info);

            // const addedCreditCard= await logic.addCreditCard(creditCard);
            response.status(201).json(info);


    }
    catch(err: any) {
        next(err);
    }
});


export default router;

