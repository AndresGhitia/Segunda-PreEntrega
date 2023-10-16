import MongoSingleton from './mongo.singleton.js'
import program from '../utils/commander.js'
import dotenv from "dotenv"
import logger from './logger.js'

const { mode } = program.opts()

dotenv.config({path: './.env'})
dotenv.config({
    path: mode === 'development' ? './.env.development': './.env.production' 
})

export const mongoInstance = async () => {
  try {
    await MongoSingleton.getInstance();
  } catch (err) {
    logger.error(err);
  }
}

export default {enviroment: mode}