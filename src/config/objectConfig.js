import  MongoSingleton  from "./mongo.singleton.js";
import program from "../utils/commander.js";
import dotenv from "dotenv"


const { mode } = program.opts()

dotenv.config({path: './.env'})
dotenv.config({
    path: mode === 'development' ? './.env.development': './.env.production' 
})

const mongoInstance = async () => {
    try{
        await MongoSingleton.getInstance()
    }catch(err){
        console.log(err);
    }
}

export default mongoInstance;
