import express, { NextFunction, Request, Response } from "express";
import { ReviewModel } from "../03-models/review-model";
import logic from "../05-BLL/review-logic"

const router = express.Router();

// Route for getting all review:
router.get("/",async (request: Request, response: Response, next: NextFunction) => {
    try{
        const reviews = await logic.getAllReview();
        response.json(reviews);
    }
    catch(err: any) {
        next(err);
    }
});

// Route for getting all review:
router.get("/:productId",async (request: Request, response: Response, next: NextFunction) => {
    try{
        const productId = request.params.productId;
        const reviews = await logic.getAllReviewByProductId(productId);
        response.json(reviews);
    }
    catch(err: any) {
        next(err);
    }
});

// Route for adding a user:
router.post("/",async (request: Request, response: Response, next: NextFunction) => {
    try{
        const reviewToAdd = new ReviewModel(request.body);
        const addedReview= await logic.addReview(reviewToAdd);
        response.status(201).json(reviewToAdd);
    }
    catch(err: any) {
        next(err);
    }
});


export default router;