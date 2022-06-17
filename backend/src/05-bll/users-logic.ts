import mongoose from "mongoose";
import jwt from "../01-utils/jwt";
import ClientError from "../03-models/client-error";
import { ICredentialsModel } from "../03-models/credentials-model";
import { IUserModel, UserModel } from "../03-models/user-model";

// Register:
async function register(user: IUserModel): Promise<string> {
    
    // validate:
    const errors = user.validateSync();
    if(errors) throw new ClientError(404, errors.message);
    
    // Validate username and email does not exist in DB:
    const users = await getAllUsers();
    const exist = users.find(u => u.userName === user.userName || u.email === user.email);
    if (exist) throw new ClientError(401, "User name or email already in use.");
    
    // Using user logic:
    // const newUser = await userLogic.addUser(user);
    const newUser = await user.save();
    
    // Delete password before generating token for security:
    delete user.password;

    // Create new token:
    const token = jwt.getNewToken(newUser);

    return token;
}

// Login:
async function login(credentials: ICredentialsModel): Promise<string> {
    // Validate:
    const errors = credentials.validateSync();
    if(errors) throw new ClientError(404, errors.message);

    const users = await getAllUsers(); 
    // Check if user exist in database:
    const user =  users.find(u => u.userName === credentials.username && u.password === credentials.password);
    if(!user) throw new ClientError(401, "Incorrect username or password");
    
    // Delete password before generating token for security:
    delete user.password;
    
    const token = jwt.getNewToken(user);

    return token;
}



async function getAllUsers(): Promise<IUserModel[]> {
    return UserModel.find();
}

async function getOneUser(_id: string): Promise<IUserModel> {
    // Validate _id:
    if(!mongoose.isValidObjectId(_id)) throw new ClientError(404, `_id ${_id} is invalid`);

    // Get user:
    const user = await UserModel.findById(_id).exec();

    // Validate user existence:
    if(!user) throw new ClientError(404, "User not found");

    return user;
}

// Get one user by username:
async function getUserIdByUserName(userName: string): Promise<IUserModel> {
    const user = await UserModel.findOne({ "userName": userName }).exec();
    return user;
}


async function addUser(user: IUserModel): Promise<IUserModel> {
    // Validation:
    const errors = user.validateSync();
    if(errors) throw new ClientError(400, errors.message);

    // save
    const addedUser = user.save();
    return addedUser;
}

async function updateUser(user: IUserModel): Promise<IUserModel> {
    // Validation:
    const errors = user.validateSync();
    if(errors) throw new ClientError(404, errors.message);
    
    console.log({user});
    
    // Update:
    const updatedUser = await UserModel.findByIdAndUpdate(user._id, user, {returnOriginal: false}).exec();

    // Validate if user exist in DB:
    if(!updatedUser) throw new ClientError(404, "user is not found");

    return updatedUser;
}

async function deleteUser(_id: string): Promise<void> {
    // Validate _id:
    if(!mongoose.isValidObjectId(_id)) throw new ClientError(404, `_id ${_id} is not valid`);

    const deletedUser = await UserModel.findByIdAndDelete(_id).exec();

    if(!deletedUser) throw new ClientError(404, "user is not found");
}


export default {
    register,
    login,
    getAllUsers,
    getOneUser,
    addUser,
    updateUser,
    deleteUser,
    getUserIdByUserName
}