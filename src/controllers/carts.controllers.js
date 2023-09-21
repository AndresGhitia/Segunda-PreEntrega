
export class CartsControllers{
    static renderGetCartId = async (req, res) => {
        try{
            res.status(200).send({status: 'succes', payload: await cartService.getCartById(req.params.cid)})
        }catch(error){  
            res.status(400).send({status: 'error', message: error.message})
        }
      }
    
    static renderCreateCart = async (req, res) => {
        try{
            await cartService.createCart()
            res.status(200).send({status: 'succes', payload: await cartService.getCarts()})
        }catch(error){
            res.status(400).send({status: 'error', message: error.message})
        }
      }
    
    static renderAddCart = async (req, res) => {
        try{
            await cartService.addProductToCart(req.params.cid, req.params.pid)
            res.status(200).send({status: 'succes', payload: await cartService.getCarts()})
        }catch (error){
            res.status(400).send({status: 'error', message: error.message})
        }
      }
    
    static renderUpdateCart =  async (req, res) => {
        try{
            const { products } = req.body
            await cartService.updateCart(req.params.cid, products)
            res.status(200).send({status: 'succes', payload: await cartService.getCarts()})
        }catch(error){
            res.status(400).send({status: 'error', message: error.message})
        }
      }
    
    static renderQuantityCart =  async (req, res) => {
        try{
            const quantity = req.body.quantity
            await cartService.updateQuantity(req.params.cid, req.params.pid, quantity)
            res.status(200).send({status: 'succes', payload: await cartService.getCarts()})
        }catch(error){
            res.status(400).send({status: 'error', message: error.message})
        }
      }

    static renderDeleteProductCart = async (req,res) => {
        try{
            await cartService.deleteProductFromCart(req.params.cid, req.params.pid)
            res.status(200).send({status: 'succes', payload: await cartService.getCarts()})
        }catch(error){
            res.status(400).send({status: 'error', message: error.message})
        }
      }
    
    static renderDeleteAllCart = async (req,res) => {
        try{
            await cartService.deleteAllProductsFromCart(req.params.cid)
            res.status(200).send({status: 'succes', payload: await cartService.getCarts()})
        }catch(error){
            res.status(400).send({status: 'error', message: error.message})
        }
      }

}