import express, { NextFunction, Request, Response } from "express";
// import logic from "../05-bll/cart-logic";
import logic from "../05-bll/message-logic";
import { MessageModel } from "../03-models/message-model";

const router = express.Router();

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


// Route for getting last message :
router.get("/lastMsg",async (request: Request, response: Response, next: NextFunction) => {
    try{
        const lastInsertedMsg = await logic.getLatestMsg();       
        response.json(lastInsertedMsg);
    }
    catch(err: any) {
        next(err);
    }
});

// Route for getting one that send msg to database :
router.get("/by-user",async (request: Request, response: Response, next: NextFunction) => {
    try{
        const users = await logic.getAllMsgUsers();
        response.json(users);
    }
    catch(err: any) {
        next(err);
    }
});

// ADD MSG
router.post("/", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const message = new MessageModel(request.body);
        const addedMessage= await logic.addMessage(message);
        response.status(201).json(addedMessage);
    }
    catch(err: any) {
        next(err);
    }
});

export default router;
