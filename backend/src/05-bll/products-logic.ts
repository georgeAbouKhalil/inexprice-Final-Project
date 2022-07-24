import mongoose from "mongoose";
import ClientError from "../03-models/client-error";
import { IProductModel, ProductModel } from "../03-models/product-model";

// Get all:
async function getAllProduct(): Promise<IProductModel[]> {
    return ProductModel.find().populate("category").exec();
}

// Get one:
async function getOneProduct(_id: string): Promise<IProductModel> {

    if (!mongoose.Types.ObjectId.isValid(_id)) throw new ClientError(404, `_id ${_id} not valid`); 

    const product = await ProductModel.findById(_id).populate("category").exec();
    if (!product) throw new ClientError(404, `_id ${_id} not found`);

    return product;
}

// Insert:
async function addProduct(product: IProductModel): Promise<IProductModel> {

    // Validation:
    const errors = product.validateSync();
    if (errors) throw new ClientError(400, errors.message);

    // Add:
    return product.save();
}

// Update:
async function updateProduct(product: IProductModel): Promise<IProductModel> {

    if (!mongoose.Types.ObjectId.isValid(product._id)) throw new ClientError(404, `_id ${product._id} not valid`);

    // Validation:
    const errors = product.validateSync();
    if (errors) throw new ClientError(400, errors.message);

    // Update:
    const updatedProduct = await ProductModel.findByIdAndUpdate(product._id, product, { returnOriginal: false }).exec();
    if (!updatedProduct) throw new ClientError(404, `_id ${product._id} not found`);

    // Return updated product:
    return updatedProduct;
}

async function getProductsByTypes(_id: string): Promise<IProductModel[] | any> {
    // Validate _id:
    if (!mongoose.isValidObjectId(_id)) throw new ClientError(404, `_id ${_id} is invalid`);

    const products = await ProductModel.find({"type": _id}).populate("category").exec();

    // If empty throw error:
    if(products.length === 0) throw new ClientError(404, "There are no products in the requested category");

    return products;
}

// Delete:
async function deleteProduct(_id: string): Promise<void> {
    if (!mongoose.Types.ObjectId.isValid(_id)) throw new ClientError(404, `_id ${_id} not valid`);
    const deletedProduct = await ProductModel.findByIdAndDelete(_id).exec();
    if (!deletedProduct) throw new ClientError(404, `_id ${_id} not found`);
}

export default {
    getAllProduct,
    getOneProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductsByTypes,
};
