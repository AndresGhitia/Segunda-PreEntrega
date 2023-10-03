import { productService } from "../service/index.js"

class ProductController {
    get = async (req, res) => {
        try{
            let queryPage = ''
            if (req.query.page) {
                queryPage = parseInt(req.query.page);
                if (isNaN(queryPage) || queryPage < 1) {
                    throw new Error('Numero de pagina invalida');
                }
            }
    
            let query = {}
            if(req.query.query === undefined){ // query undefined
                query = {}
            }else if(req.query.query === 'true'){ // status === true
                query.status = true
            }else if(req.query.query === 'false'){ // status === false
                query.status = false
            }else{ // category === req.query.params
                query.category = req.query.query
            }
    
            let sort = null
            if (req.query.sort === "asc") { // asc or desc
                sort = { price: 1 };
            } else if (req.query.sort === "desc") {
                sort = { price: -1 };
            }
    
            const options = {
                limit: req.query.limit ? parseInt(req.query.limit) : 10,
                page: req.query.page ? parseInt(req.query.page) : 1,
                sort: sort
            }
            
            let prevLink = ''
            let nextLink = ''
    
            const products = await productService.get(query, options)
            const { docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage } = products

            if(query.status !== undefined){ // if query.status exists
                hasPrevPage === false ? prevLink = null : prevLink = `/products?page=${parseInt(prevPage)}&limit=${options.limit}&sort=${req.query.sort}&query=${query.status}`
                hasNextPage === false ? nextLink = null : nextLink = `/products?page=${parseInt(nextPage)}&limit=${options.limit}&sort=${req.query.sort}&query=${query.status}`
            }else if(query.category !== undefined){ // if query.category exists
                hasPrevPage === false ? prevLink = null : prevLink = `/products?page=${parseInt(prevPage)}&limit=${options.limit}&sort=${req.query.sort}&query=${query.category}`
                hasNextPage === false ? nextLink = null : nextLink = `/products?page=${parseInt(nextPage)}&limit=${options.limit}&sort=${req.query.sort}&query=${query.category}`
            }else{ // if there isn't query values
                hasPrevPage === false ? prevLink = null : prevLink = `/products?page=${parseInt(prevPage)}&limit=${options.limit}&sort=${req.query.sort}`
                hasNextPage === false ? nextLink = null : nextLink = `/products?page=${parseInt(nextPage)}&limit=${options.limit}&sort=${req.query.sort}`
            }
            return { products: docs, totalPages, prevPage, nextPage, page, hasPrevPage, hasNextPage, prevLink, nextLink, session: req.user }
        }catch(error){
            throw error
        }
    }

    getById = async (req, res) => {
        try{
            const product = await productService.getById(req.params.pid)
            return { product }
        }catch(error){
            throw error
        }
    }

    create = async (req, res) => {
        try{
            const product = req.body
            const addedProduct = await productService.create(product)
            return { addedProduct }
        }catch (error){
            throw error
        }
    }

    update = async (req, res) => {
        try{
            const product = req.body
            const updatedProduct = await productService.update(req.params.pid, product)
            return { updatedProduct }
        }catch (error){
            throw error
        }
    }

    delete = async (req, res) => {
        try{
            const deletedProduct = await productService.delete(req.params.pid)
            return { deletedProduct }
        }catch(error){
            throw error
        }
    }
}

export default new ProductController