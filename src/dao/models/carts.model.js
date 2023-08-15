import mongoose from "mongoose";
import { cartsCollection } from "../../constants/index.js";

const cartSchema = new mongoose.Schema({
  products: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products'
    },
    quantity: Number
  }]
});

cartSchema.pre('find', function(next) {
  this.populate('products.product');
  next();
});

export const cartsModel = mongoose.model(cartsCollection, cartSchema);
