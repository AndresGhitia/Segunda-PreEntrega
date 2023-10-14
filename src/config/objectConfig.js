import MongoSingleton from "./mongo.singleton.js";
import program from "../utils/commander.js";
import {logger} from "./logger.js";
import dotenv from "dotenv";

const { mode } = program.opts();

dotenv.config({
    path: mode === 'development' ? './.env.development' : './.env.production'
});


export const mongoInstance = async () => {
    try {
        await MongoSingleton.getInstance();
    } catch (err) {
        logger.error(err);
    }
}

export default {environment: mode};
