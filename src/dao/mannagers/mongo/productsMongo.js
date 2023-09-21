import { productsModel } from "../../models/products.model.js";

export class ProductsDao {
  constructor() {
    this.model = productsModel;
  }

  async getProducts(query, options){
    try{
        return await productsModel.paginate(query, options)
    }catch(err){
        return new Error(err)
    }
}

async getWithPaginate(query, options){
  try {
      const result = await this.model.paginate(query, options);
      return result;
  } catch (error) {
      throw error;
  }
}

async getProductById(pid){
    try{
        return await productsModel.findOne({_id: pid})
    }catch(err){
        return new Error(err)
    }
}

async addProduct(product){
    try{
        return await productsModel.create(product)
    }catch(err){
        return new Error(err)
    }
}

async updateProduct(pid, product){
    try{
        return await productsModel.updateOne({_id: pid}, product)
    }catch(err){
        return new Error(err)
    }
}

async deleteProduct(pid){
    try{
        return await productsModel.deleteOne({_id: pid})
    }catch(err){
        return new Error(err)
    }
}
};