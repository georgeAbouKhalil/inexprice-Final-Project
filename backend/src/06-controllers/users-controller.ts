import express, { NextFunction, Request, Response } from "express";
import { CredentialsModel } from "../03-models/credentials-model";
import { UserModel } from "../03-models/user-model";
import logic from "../05-BLL/users-logic"

const router = express.Router();

// Register
router.post("/register", async (request : Request, response: Response, next: NextFunction) => {
    try{
        request.body.role = "user"; // Make sure added user has User role
        request.body.favorite = [ {name:"shoes", rating:1},
                                  {name:"pants", rating:0},
                                  {name:"T-shirt",rating:0},
                                  {name:"shirt",rating:0},
                                  {name:"slippers",rating:0},
                                  {name:"jacket",rating:0},
                                  {name:"socks",rating:0},
                                  {name:"laptop",rating:0},
                                  {name:"headphone",rating:0},
                                  {name:"baby suit",rating:0},
                                  {name:"hoodie",rating:0},
                                  {name:"T-shirt/pants",rating:0},
                                  {name:"bags",rating:0},
                                  {name:"Mask",rating:0},
                                  {name:"Tank",rating:0},
                                  {name:"Phone",rating:0},
                                  {name:"Tablet",rating:0},
                                  {name:"Telescope",rating:0},
                                  {name:"Watch",rating:0},
                                  {name:"Training Suit",rating:0},
                                  {name:"Camera",rating:0},];
        const user = new UserModel(request.body);
        const token = await logic.register(user);
        response.status(201).json(token);
    }
    catch(err: any) {
        next(err);
    }
});

// Login
router.post("/login", async (request : Request, response: Response, next: NextFunction) => {
    try{
        const credentials = new CredentialsModel(request.body);
        const token = await logic.login(credentials);
        response.status(201).json(token);
    }
    catch(err: any) {
        next(err);
    }
});


// Route for getting all users:
router.get("/",async (request: Request, response: Response, next: NextFunction) => {
    try{
        const users = await logic.getAllUsers();
        response.json(users);
    }
    catch(err: any) {
        next(err);
    }
});
// Route for getting all users:
router.get("/user/:userName",async (request: Request, response: Response, next: NextFunction) => {
    try{
        const userName = request.params.userName;
        const users = await logic.getUserIdByUserName(userName);
        response.json(users);
    }
    catch(err: any) {
        next(err);
    }
});

// Route for getting favorite rating:
router.get("/rating/:userName",async (request: Request, response: Response, next: NextFunction) => {
    try{
        const userName = request.params.userName;
        const user = await logic.getRating(userName);
        response.json(user);
    }
    catch(err: any) {
        next(err);
    }
});

// Route for getting one user:
router.get("/:_id",async (request: Request, response: Response, next: NextFunction) => {
    try{
        const _id = request.params._id;
        const user = await logic.getOneUser(_id);
        response.json(user);
    }
    catch(err: any) {
        next(err);
    }
});

// Route for adding a user:
router.post("/",async (request: Request, response: Response, next: NextFunction) => {
    try{
        const userToAdd = new UserModel(request.body);
        const addedUser = await logic.addUser(userToAdd);
        response.status(201).json(addedUser);
    }
    catch(err: any) {
        next(err);
    }
});

// Route for updating a user:
router.put("/:id",async (request: Request, response: Response, next: NextFunction) => {
    try{
        const userToUpdate = new UserModel(request.body);
        const updatedUser = await logic.updateUser(userToUpdate);
        response.status(201).json(updatedUser);
    }
    catch(err: any) {
        next(err);
    }
});


// Route for updating a user:
router.patch("/:id",async (request: Request, response: Response, next: NextFunction) => {
    try{
        request.body._id = request.params.id;
        const newDetails = new UserModel(request.body);
        const updatedUser = await logic.updatePartialUser(newDetails);
        response.status(201).json(updatedUser);
    }
    catch(err: any) {
        next(err);
    }
});

// Route for deleting a user:
router.delete("/:_id",async (request: Request, response: Response, next: NextFunction) => {
    try{
        const _id = request.params._id;
        await logic.deleteUser(_id);
        response.sendStatus(204);
    }
    catch(err: any) {
        next(err);
    }
});

export default router;