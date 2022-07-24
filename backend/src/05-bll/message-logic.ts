import { IMessageModel, MessageModel } from './../03-models/message-model';
import mongoose from "mongoose";
import ClientError from "../03-models/client-error";

// Get latest added message:
async function getLatestMsg(): Promise<IMessageModel | any> {
    const lastMsg = await MessageModel.find({}).sort({_id:-1}).limit(1);
    return lastMsg[0];

}

async function getMsgByUserId(userId: string): Promise<IMessageModel | any> {
    // Validate _id:
    if (!mongoose.isValidObjectId(userId)) throw new ClientError(404, `user_id ${userId} is invalid`);

    const msgs = await MessageModel.find({ $or: [{ "userId": userId }, { "toUser": userId }] }).populate("user").exec();
    return msgs;
}

// get all users that have msg in database
async function getAllMsgUsers(): Promise<IMessageModel[]> {

    // get the userName without duplication
    return MessageModel.aggregate([
        {
            $group: {
                _id: {
                    userId: "$userId",
                    userName: "$userName",
                },
            },

        },
    ]);

}


// Insert:
async function addMessage(message: IMessageModel): Promise<IMessageModel> {

    // Validation:
    const errors = message.validateSync();
    if (errors) throw new ClientError(400, errors.message);

    // Add:
    return message.save();
}




export default {
    addMessage,
    getAllMsgUsers,
    getMsgByUserId,
    getLatestMsg
};
