import express, { NextFunction, Request, Response } from "express";
import logic from "../05-bll/creditCards-logic";
import { CreditCardModel } from '../03-models/creditCard-model';

const router = express.Router();

router.get("/", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const creditCards = await logic.getAllCreditCards();
        response.json(creditCards);
    }
    catch(err: any) {
        next(err);
    }
});

router.get("/:_id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id;
        const creditCard = await logic.getOneCreditCard(_id);
        response.json(creditCard);
    }
    catch(err: any) {
        next(err);
    }
});

router.post("/", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const creditCard = new CreditCardModel(request.body);
        const addedCreditCard= await logic.addCreditCard(creditCard);
        response.status(201).json(addedCreditCard);
    }
    catch(err: any) {
        next(err);
    }
});

router.put("/:_id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id;
        request.body._id = _id;
        const creditCard = new CreditCardModel(request.body);
        const updatedCreditCard = await logic.updateCreditcard(creditCard);
        response.json(updatedCreditCard);
    }
    catch(err: any) {
        next(err);
    }
});

router.delete("/:_id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id;
        await logic.deleteCreditcard(_id);
        response.sendStatus(204);
    }
    catch(err: any) {
        next(err);
    }
}); 

router.get("/by-user/:userId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const userId = request.params.userId;
        const creditItem = await logic.getAllCreditCardsByUserId(userId);
        response.json(creditItem);
    }
    catch(err: any) {
        next(err);
    }
});

export default router;
