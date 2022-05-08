import { CartItemModel } from '../03-models/cartItem-model';
import express, { NextFunction, Request, Response } from "express";
import logic from "../05-bll/cartItem-logic";

const router = express.Router();

router.get("/", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const cartItem = await logic.getAllCartItem();
        response.json(cartItem);
    }
    catch(err: any) {
        next(err);
    }
});

router.get("/:_id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id;
        const cartItem = await logic.getOneCartItem(_id);
        response.json(cartItem);
    }
    catch(err: any) {
        next(err);
    }
});

router.post("/", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const cartItem = new CartItemModel(request.body);
        const addedCartItem= await logic.addCartItem(cartItem);
        response.status(201).json(addedCartItem);
    }
    catch(err: any) {
        next(err);
    }
});

router.put("/", async (request: Request, response: Response, next: NextFunction) => {
    try {
        // const _id = request.params._id;
        // console.log('*******  ' ,_id);
        // request.body._id = _id;
        // console.log('*******  ' ,request.body);
        // request.body._id = request.params._id;
        // const productId = request.params.id;
        // const cartItem = new CartItemModel(request.body);
        let product = request.body;
                console.log({product});
        
        const updatedCartItem = await logic.updateCartItem(product);
        response.json(updatedCartItem);
    }
    catch(err: any) {
        next(err);
    }
});

router.delete("/:_id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id;
        await logic.deleteCartItem(_id);
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

        // const products = await logic.getHolidaysUsingRegex();
        
        // response.json(products);
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
