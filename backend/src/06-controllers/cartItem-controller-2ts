import express, { NextFunction, Request, Response } from "express";
import { CartItemModel } from "../03-models/cartItem-model";
import logic from "../05-bll/cartItem-logic-2";

const router = express.Router();

// Route for getting all :
router.get("/by-cart/:cartId",async (request: Request, response: Response, next: NextFunction) => {
    try{
        const cartId = request.params.cartId;
        const cartProd = await logic.getAllCartProducts(cartId);
        response.json(cartProd);
    }
    catch(err: any) {
        next(err);
    }
});

// // Route for getting one :
// router.get("/:_id",async (request: Request, response: Response, next: NextFunction) => {
//     try{
      
//     }
//     catch(err: any) {
//         next(err);
//     }
// });

// Route for adding a :
router.post("/",async (request: Request, response: Response, next: NextFunction) => {
    try{
        // const prodId = request.body.productId;
        // console.log(prodId)
        const cartProdToAdd = new CartItemModel(request.body);
        const addedCartProd = await logic.addCartProduct(cartProdToAdd);
        response.status(201).json(addedCartProd);
    }
    catch(err: any) {
        next(err);
    }
});

// Route for updating a :
router.put("/:_id",async (request: Request, response: Response, next: NextFunction) => {
    try{
        request.body._id = request.params._id;
        const cartProdToUpdate = new CartItemModel(request.body);
        const updatedCartProd = await logic.updateCartProduct(cartProdToUpdate);
        response.status(201).json(updatedCartProd);
    }
    catch(err: any) {
        next(err);
    }
});

// Route for deleting a :
router.delete("/:_id",async (request: Request, response: Response, next: NextFunction) => {
    try{
        const idToDelete = request.params._id;
        await logic.deleteCartProduct(idToDelete);
        response.sendStatus(204);
    }
    catch(err: any) {
        next(err);
    }
});


export default router;