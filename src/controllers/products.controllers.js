import { productService,} from "../dao/index.js";

export class ProductsControllers{
    static renderGetProducts = async (req, res) => {
        try{
            let query = {}
            if(req.query.query === undefined){ 
                query = {}
            }else if(req.query.query === 'true'){ 
                query.status = true
            }else if(req.query.query === 'false'){
                query.status = false
            }else{
                query.category = req.query.query
            }
      
            let sort = null
            if (req.query.sort === "asc") {
                sort = { price: 1 };
            } else if (req.query.sort === "desc") {
                sort = { price: -1 };
            }
      
            const options = {
                limit: req.query.limit ? parseInt(req.query.limit) : 10,
                page: req.query.page ? parseInt(req.query.page) : 1,
                sort: sort
            }
      
            const products = await productService.getProducts(query, options)
            const { docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage } = products
            let prevLink = null;
            let nextLink = null;
        
            hasPrevPage === false ? prevLink = null : prevLink = `/api/products?page=${parseInt(prevPage)}`;
            hasNextPage === false ? nextLink = null : nextLink = `/api/products?page=${parseInt(nextPage)}`;
        
            res.status(200).send({status: 'succes', payload: docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, prevLink, nextLink })
        }catch(error){
            res.status(400).send({status: 'error', message: error.message})
        }
      }

    static renderGetProductsById =  async (req, res) => {
        try{
            const product = await productService.getProductById(req.params.pid)
            res.status(200).send({status: 'succes', payload: product, message: "Producto encontrado"})
        }catch(error){
            res.status(400).send({status: 'error', message: error.message, message:"Producto no encontrado"})
        }
      }

    static renderAddProduct = async (req, res) => {
        try{
            const product = req.body
            await productService.addProduct(product)
            res.status(200).send({status: 'succes', payload: await productService.getProducts(), message: "Producto agregado con exito" })
        }catch (error){
            res.status(400).send({status: 'error', message: error.message})
        }
      }

    static renderUpdateProduct = async (req, res) => {
        try{
          const product = req.body
          await productService.updateProduct(req.params.pid, product)
          res.status(200).send({status: 'succes', payload: await productService.getProducts(), message: "Producto actualizado con exito"})
      }catch (error){
          res.status(400).send({status: 'error', message: error.message})
      }
    }

    static renderDeleteProduct = async (req, res) => {
        try{
            await productService.deleteProduct(req.params.pid)
            res.status(200).send({status: 'succes', payload: await productService.getProducts(), message: "Producto eliminado con exito" })
        }catch(error){
            res.status(400).send({status: 'error', message: error.message})
        }
      }
}