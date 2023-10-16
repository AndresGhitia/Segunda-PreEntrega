import mongoose from 'mongoose';
import logger from './logger.js';

class MongoSingleton {
    static #instance;

    constructor() {
        this.#connectMongoDB();
    }

    static getInstance() {
        if (this.#instance) {
            logger.info('There is already a connection with MongoDB');
        } else {
            this.#instance = new MongoSingleton();
        }
        return this.#instance;
    }

    #connectMongoDB = async () => {
        try {
            await mongoose.connect(process.env.MONGO_URL);
            logger.info('Conexion exitosa con MongoDB');
        } catch (err) {
            logger.error('No fue posible connectarse a MongoDB: ' + err);
            process.exit();
        }
    }
}

export default MongoSingleton;
