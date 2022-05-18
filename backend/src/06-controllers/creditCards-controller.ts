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

router.get("/test", async (request: Request, response: Response, next: NextFunction) => {
    try {

        // const products = await logic.getPartialProducts();
        
        // const products = await logic.getSomeProducts();

        // const products = await logic.getPagedProducts();

        const products = await logic.getCreditCardsUsingRegex();
        
        response.json(products);
    }
    catch(err: any) {
        next(err);
    }
});

// router.get("/products-paging/:page", async (request: Request, response: Response, next: NextFunction) => {
//     try {

//         const page = +request.params.page;

//         // const products = await logic.getPartialProducts();
        
//         const products = await logic.getSomeProducts();
        
//         response.json(products);
//     }
//     catch(err: any) {
//         next(err);
//     }
// });

export default router;
