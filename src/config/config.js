import dotenv from "dotenv";

// Carga las variables de entorno desde el archivo .env
dotenv.config();

export const config = {
  server: {
    port: 8080
  },
  fileSystem: {
    productsFile: "products.json",
    cartsFile: "carts.json",
  },
  mongo: {
    url: "mongodb+srv://andresghitia:Coderhouse255@cluster0.5rinmzl.mongodb.net/ecommerce?retryWrites=true&w=majority"
  },
};
