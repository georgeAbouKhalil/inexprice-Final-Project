import mongoose from "mongoose";
import ClientError from "../03-models/client-error";
import { IUserModel, UserModel } from "../03-models/user-model";
import { IReviewModel, ReviewModel} from "../03-models/review-model";



//get all reviees
async function getAllReview(): Promise<IReviewModel[]> {
    return ReviewModel.find().populate("user").populate("product").exec();
}


//get all reviees by productId
async function getAllReviewByProductId(productId:any): Promise<IReviewModel[]> {
    return ReviewModel.find({'productId' : productId}).populate("user").populate("product").exec();
}

//add review
async function addReview(review: IReviewModel): Promise<IReviewModel> {
    // Validation:
    const errors = review.validateSync();
    if (errors) throw new ClientError(400, errors.message);

    // save
    const addedReview = review.save();
    return addedReview;
}



// // Get all
// async function getAverageRating(): Promise<IReviewModel[]> {

//     // get the sum of quantity per product
//     const averageRating = ReviewModel.aggregate([
//         {
//             $group: {
//                 _id: {
//                 }, quantity: { "$avg": "$rating" }
//             }
//         },
//     ]);

//     console.log({averageRating});
    

//     return averageRating;
// }


export default {
    getAllReview,
    addReview,
    getAllReviewByProductId,
    // getAverageRating
}