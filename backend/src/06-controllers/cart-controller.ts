import express, { NextFunction, Request, Response } from "express";
import logic from "../05-bll/cart-logic";
import { CartModel } from '../03-models/cart-model';

const router = express.Router();

router.get("/", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const carts = await logic.getAllCarts();
        response.json(carts);
    }
    catch(err: any) {
        next(err);
    }
});

router.get("/:_id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id;
        const cart = await logic.getOneCart(_id);
        response.json(cart);
    }
    catch(err: any) {
        next(err);
    }
});

// Route for getting one by userId :
router.get("/by-user/:userId",async (request: Request, response: Response, next: NextFunction) => {
    try{
        const userId = request.params.userId;
        const cart = await logic.getOneCartByUserId(userId);
        response.json(cart);
    }
    catch(err: any) {
        next(err);
    }
});

router.post("/", async (request: Request, response: Response, next: NextFunction) => {
    try {
        
        request.body.status = "open"; 
        console.log(request.body);
        const cart = new CartModel(request.body);
        const addedCart= await logic.addCart(cart);
        response.status(201).json(addedCart);
    }
    catch(err: any) {
        next(err);
    }
});

router.put("/:_id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id;
        request.body._id = _id;
        const cart = new CartModel(request.body);
        const updatedCart = await logic.updateCart(cart);
        response.json(updatedCart);
    }
    catch(err: any) {
        next(err);
    }
});

router.delete("/:_id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id;
        await logic.deleteCart(_id);
        response.sendStatus(204);
    }
    catch(err: any) {
        next(err);
    }
}); 

export default router;
