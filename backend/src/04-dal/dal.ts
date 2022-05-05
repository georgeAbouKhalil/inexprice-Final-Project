import { connect } from "mongoose" // ORM
import config from "../01-utils/config";

async function connectToMongoDB(): Promise<void> {
    try {
        const db = await connect(config.mongoConnectionString);
        console.log("We're connected to " + db.connections[0].name);
    }
    catch(err: any) {
        console.log(err);
    }
}

export default {
    connectToMongoDB
};

