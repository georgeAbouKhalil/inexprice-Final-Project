import express from "express";
import cors from "cors";
import socketLogic from "./05-bll/socket-logic";
import config from "./01-utils/config";
import con from "./04-dal/dal";
con.connectToMongoDB();
import productsController from "./06-controllers/products-controller";
import holidaysController from "./06-controllers/holidays-controller";
import cartItemController from "./06-controllers/cartItem-controller";
import ordersController from "./06-controllers/orders-controller";
import errorsHandler from "./02-middleware/errors-handler";
import usersController from "./06-controllers/users-controller";
import cartController from "./06-controllers/cart-controller";
import typesController from "./06-controllers/types-controller";
import creditCardsController from "./06-controllers/creditCards-controller";
import wishListController from "./06-controllers/wishlist-controller";
import MessageController from "./06-controllers/message-controller";
import MailController from "./06-controllers/email-controller";
import ReviewController from "./06-controllers/review-controller";

const server = express();

server.use(cors());
server.use(express.json());
server.use("/api/products", productsController);
server.use("/api/holidays", holidaysController);
server.use("/api/auth", usersController);
server.use("/api/carts", cartController);
server.use("/api/cartItem", cartItemController);
server.use("/api/orders", ordersController);
server.use("/api/categories", typesController);
server.use("/api/creditCard", creditCardsController);
server.use("/api/wishList", wishListController);
server.use("/api/message", MessageController);
server.use("/api/mail", MailController);
server.use("/api/review",ReviewController );

server.use(errorsHandler);


const httpServer = server.listen(config.port, () => console.log("Listening..."));    
socketLogic.socketIo(httpServer);


