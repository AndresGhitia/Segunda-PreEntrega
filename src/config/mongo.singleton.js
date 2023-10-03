import mongoose from "mongoose";

class MongoSingleton {
  static #instance;

  constructor() {
    this.#connectMongoDB();
  }

  static getInstance() {
    if (this.#instance) {
      console.log('Ya existe una conexión con MongoDB');
    } else {
      this.#instance = new MongoSingleton();
    }
    return this.#instance;
  }

  #connectMongoDB = async () => {
    try{
        await mongoose.connect('mongodb+srv://andresghitia:Coderhouse255@cluster0.5rinmzl.mongodb.net/ecommerce?retryWrites=true&w=majority')
        console.log('Conexion exitosa con MongoDB')
    }catch(err){
        console.log('No se pudo conectar con MongoDB: ' + err)
        process.exit()
    }
  }
}

export default MongoSingleton;
