import { OrderModel } from '../03-models/order-model';
import express, { NextFunction, Request, Response } from "express";
import logic from "../05-bll/orders-logic";
import cartLogic from '../05-bll/cart-logic';

const router = express.Router();

router.get("/", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const orders = await logic.getAllOrders();
        response.json(orders);
    }
    catch(err: any) {
        next(err);
    }
});

router.get("/by-user/:userId", async (request: Request, response: Response, next: NextFunction) => {
    try {

     
        const userId = request.params.userId;
        const orders = await logic.getAllOrdersByUserId(userId);
        response.json(orders);
    }
    catch(err: any) {
        next(err);
    }
});

router.get("/:_id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id;
        const order = await logic.getOneOrder(_id);
        response.json(order);
    }
    catch(err: any) {
        next(err);
    }
});

router.post("/", async (request: Request, response: Response, next: NextFunction) => {
    try {
        request.body.order_number = Math.floor(Math.random() * 1000000) ; 
        const order = new OrderModel(request.body);
        const addedOrder= await logic.addOrder(order);

       const cart =  await cartLogic.getOneCartByUserId(order.user_id.toString());
        cart.status = "close";
        await cartLogic.updateCart(cart);
        response.status(201).json(addedOrder);
    }
    catch(err: any) {
        next(err);
    }
});

router.put("/:_id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id;
        request.body._id = _id;
        const order = new OrderModel(request.body);
        const updatedOrder = await logic.updateOrder(order);
        response.json(updatedOrder);
    }
    catch(err: any) {
        next(err);
    }
});

router.delete("/:_id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id;
        await logic.deleteOrder(_id);
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
