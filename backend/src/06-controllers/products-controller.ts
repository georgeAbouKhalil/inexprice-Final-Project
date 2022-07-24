import express, { NextFunction, Request, Response } from "express";
import { ProductModel } from "../03-models/product-model";
import logic from "../05-bll/products-logic";

const router = express.Router();

router.get("/", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const products = await logic.getAllProduct();
        response.json(products);
    }
    catch(err: any) {
        next(err);
    }
});

router.get("/:_id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id;
        const product = await logic.getOneProduct(_id);
        response.json(product);
    }
    catch(err: any) {
        next(err);
    }
});

router.post("/", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const product = new ProductModel(request.body);
        const addedProduct = await logic.addProduct(product);
        response.status(201).json(addedProduct);
    }
    catch(err: any) {
        next(err);
    }
});

router.put("/:_id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id;
        request.body._id = _id;
        const product = new ProductModel(request.body);
        const updatedProduct = await logic.updateProduct(product);
        response.json(updatedProduct);
    }
    catch(err: any) {
        next(err);
    }
});

// Route for getting all by category:
router.get("/by-types/:catId", async (request : Request, response : Response, next : NextFunction) => {
    try {
        const _id = request.params.catId;
        const products = await logic.getProductsByTypes(_id);
        response.json(products);
    } catch (err : any) {
        next(err);
    }
});

router.delete("/:_id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id;
        await logic.deleteProduct(_id);
        response.sendStatus(204);
    }
    catch(err: any) {
        next(err);
    }
}); 

export default router;
