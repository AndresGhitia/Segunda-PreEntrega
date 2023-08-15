import { cartsModel } from "../../models/carts.model.js";

export class CartsMongo {
  constructor() {
    this.model = cartsModel;
  }

  async createCart(){
    try{
        return await cartsModel.create({products: []})
    }catch(err){
        return new Error(err)
    }
}

async getCarts(){
    try{
        return await cartsModel.find({})
    }catch(err){
        return new Error(err)
    }
}

async getCartById(cid){
    try{
        return await cartsModel.findOne({_id: cid}).populate('products.product')
    }catch(err){
        return new Error(err)
    }
}

async addProductToCart(cid, pid){
    const cart = await cartsModel.findById(cid)
    const index = cart.products.findIndex(product => product.product.toString() === pid)
    if (index === -1) {
        const update = { $push: { products: { product: { _id: pid }, quantity: 1 } } };
        await cartsModel.updateOne({ _id: cid }, update);
    } else {
        const filter = { _id: cid, 'products.product': pid };
        const update = { $inc: { 'products.$.quantity': 1 } };
        await cartsModel.updateOne(filter, update);
    }
}

async deleteProductFromCart(cid, pid){
    const cart = await cartsModel.findOne({_id: cid})
    const index = cart.products.findIndex(product => product.product == pid)

    if(index === -1){
        return null
    }else{
        const filter = { _id: cid };
        const update = { $pull: { products: { product: pid } } }
        await cartsModel.findOneAndUpdate(filter, update)
    }
}

async updateCart(cid, products){
    try{
        const update = { $set: { products: products  } }
        return await cartsModel.findOneAndUpdate({_id: cid}, update)
    }catch(error){
        return new Error(error)
    }
}

async updateQuantity(cid, pid, quantity){
    const cart = await cartsModel.findOne({_id: cid})
    const index = cart.products.findIndex(product => product.product == pid)

    if (index === -1 || quantity < 1) {
        return null
    }else {
        const filter = { _id: cid, 'products.product': pid };
        const update = { $set: { 'products.$.quantity': quantity } };
        await cartsModel.updateOne(filter, update);
    }
}

async deleteAllProductsFromCart(cid){
    try{
        const update = { $set: { products: [] } }
        await cartsModel.updateOne({ _id: cid }, update)
    }catch(error){
        return new Error(err)
    }
}
}

