import express, { NextFunction, Request, Response } from "express";
// import logic from "../05-bll/cart-logic";
import logic from "../05-bll/message-logic";
import { MessageModel } from "../03-models/message-model";

const router = express.Router();

// router.get("/", async (request: Request, response: Response, next: NextFunction) => {
//     try {
//         const carts = await logic.getAllCarts();
//         response.json(carts);
//     }
//     catch(err: any) {
//         next(err);
//     }
// });

// router.get("/:_id", async (request: Request, response: Response, next: NextFunction) => {
//     try {
//         const _id = request.params._id;
//         const cart = await logic.getOneCart(_id);
//         response.json(cart);
//     }
//     catch(err: any) {
//         next(err);
//     }
// });

// Route for getting one by userId :
router.get("/by-user/:userId",async (request: Request, response: Response, next: NextFunction) => {
    try{
        const userId = request.params.userId;
        const msgByUserId = await logic.getMsgByUserId(userId);
        response.json(msgByUserId);
    }
    catch(err: any) {
        next(err);
    }
});

// Route for getting one that send msg to database :
router.get("/by-user",async (request: Request, response: Response, next: NextFunction) => {
    try{
        // const userId = request.params.userId;
        const users = await logic.getAllMsgUsers();
        console.log({users});
        
        response.json(users);
    }
    catch(err: any) {
        next(err);
    }
});

router.post("/", async (request: Request, response: Response, next: NextFunction) => {
    try {
        console.log(request.body);
        const message = new MessageModel(request.body);
        const addedMessage= await logic.addMessage(message);
        response.status(201).json(addedMessage);
    }
    catch(err: any) {
        next(err);
    }
});

// router.put("/:_id", async (request: Request, response: Response, next: NextFunction) => {
//     try {
//         const _id = request.params._id;
//         request.body._id = _id;
//         const cart = new CartModel(request.body);
//         const updatedCart = await logic.updateCart(cart);
//         response.json(updatedCart);
//     }
//     catch(err: any) {
//         next(err);
//     }
// });

// router.delete("/:_id", async (request: Request, response: Response, next: NextFunction) => {
//     try {
//         const _id = request.params._id;
//         await logic.deleteCart(_id);
//         response.sendStatus(204);
//     }
//     catch(err: any) {
//         next(err);
//     }
// }); 

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
