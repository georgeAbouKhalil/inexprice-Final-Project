import { CartItemModel } from '../03-models/cartItem-model';
import express, { NextFunction, Request, Response } from "express";
import logic from "../05-bll/cartItem-logic";
import productsLogic from '../05-bll/products-logic';

const router = express.Router();

router.get("/by-cart/:cartId", async (request: Request, response: Response, next: NextFunction) => {
    try {

        const cartId = request.params.cartId;
        console.log('1 ', cartId);
        const cartItem = await logic.getAllCartItem(cartId);
        console.log({ cartItem });

        response.json(cartItem);
    }
    catch (err: any) {
        next(err);
    }
});

router.get("/:_id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id;
        const cartItem = await logic.getOneCartItem(_id);
        response.json(cartItem);
    }
    catch (err: any) {
        next(err);
    }
});

router.post("/", async (request: Request, response: Response, next: NextFunction) => {
    try {
        request.body.price = request.body.price * (1 - request.body.discount / 100);
        request.body.totalPrice = request.body.totalPrice * (1 - request.body.discount / 100);
        const cartItem = new CartItemModel(request.body);
        console.log({cartItem});
        
        //update inStock in database
        const oldProduct = await productsLogic.getOneProduct(cartItem.product_id.toString());
        oldProduct.inStock = oldProduct.inStock - cartItem.quantity;
        await productsLogic.updateProduct(oldProduct);

        const addedCartItem = await logic.addCartItem(cartItem);
        response.status(201).json(addedCartItem);
    }
    catch (err: any) {
        next(err);
    }
});

router.put("/", async (request: Request, response: Response, next: NextFunction) => {
    try {
        request.body.price = request.body.price * (1 - request.body.discount / 100);
        request.body.totalPrice = request.body.totalPrice * (1 - request.body.discount / 100);
        let product = request.body;

        //update inStock in database
        const oldProduct = await productsLogic.getOneProduct(product.product_id.toString());
        const cartItem = await logic.getOneCartItem(product._id);
        oldProduct.inStock = oldProduct.inStock + cartItem.quantity;
        oldProduct.inStock = oldProduct.inStock - product.quantity;
        await productsLogic.updateProduct(oldProduct);

        const updatedCartItem = await logic.updateCartItem(product);
        response.json(updatedCartItem);
    }
    catch (err: any) {
        next(err);
    }
});

//delete one product from cart
router.delete("/:_id", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const _id = request.params._id;
        const cartItem = await logic.getOneCartItem(_id);

        //update inStock in database
        const oldProduct = await productsLogic.getOneProduct(cartItem.product_id.toString());
        oldProduct.inStock = oldProduct.inStock + cartItem.quantity;
        await productsLogic.updateProduct(oldProduct);

        await logic.deleteCartItem(_id);
        response.sendStatus(204);
    }
    catch (err: any) {
        next(err);
    }
});

//empty cart - delete all products
router.delete("/by-cart/:cartId", async (request: Request, response: Response, next: NextFunction) => {
    try {
        const cartId = request.params.cartId;

        //update inStock in database
        const oldProducts = await logic.getAllCartItem(cartId.toString());
        for (let product of oldProducts) {
            const oldProduct = await productsLogic.getOneProduct(product.product_id.toString());
            oldProduct.inStock = oldProduct.inStock + product.quantity;
            await productsLogic.updateProduct(oldProduct);
        }

        await logic.emptyCart(cartId);
        response.json();
    }
    catch (err) {
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
    catch (err: any) {
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
