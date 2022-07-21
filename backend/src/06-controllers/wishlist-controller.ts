import express, { NextFunction, Request, Response } from "express";
import logic from "../05-bll/wishlist-logic";
import { WishListModel } from '../03-models/wishlist-model';

const router = express.Router();

router.get("/", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const wishLists = await logic.getAllWishLists();
        response.json(wishLists);
    }
    catch(err: any) {
        next(err);
    }
});

router.get("/:_id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id;
        const wishList = await logic.getOneWishList(_id);
        response.json(wishList);
    }
    catch(err: any) {
        next(err);
    }
});

// Route for getting one by userId :
router.get("/by-user/:userId",async (request: Request, response: Response, next: NextFunction) => {
    try{
        const userId = request.params.userId;
        const wishLists = await logic.getWishListByUserId(userId);
        response.json(wishLists);
    }
    catch(err: any) {
        next(err);
    }
});

router.post("/", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const wishList = new WishListModel(request.body);
        const addedWishList = await logic.addWishList(wishList);
        response.status(201).json(addedWishList);
    }
    catch(err: any) {
        next(err);
    }
});

router.put("/:_id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id;
        request.body._id = _id;
        const wishList = new WishListModel(request.body);
        const updatedWishList = await logic.updateWishList(wishList);
        response.json(updatedWishList);
    }
    catch(err: any) {
        next(err);
    }
});

router.delete("/:_id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id;
        await logic.deleteWishList(_id);
        response.sendStatus(204);
    }
    catch(err: any) {
        next(err);
    }
}); 

export default router;
