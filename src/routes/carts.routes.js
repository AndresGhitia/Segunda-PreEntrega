import { Router } from "express";
import { cartService } from "../dao/index.js";

const router = Router();

router.get('/:cid', async (req, res) => {
  try{
      res.status(200).send({status: 'succes', payload: await cartService.getCartById(req.params.cid)})
  }catch(error){  
      res.status(400).send({status: 'error', message: error.message})
  }
})

router.post('/', async (req, res) => {
  try{
      await cartService.createCart()
      res.status(200).send({status: 'succes', payload: await cartService.getCarts()})
  }catch(error){
      res.status(400).send({status: 'error', message: error.message})
  }
})

router.post('/:cid/products/:pid', async (req, res) => {
  try{
      await cartService.addProductToCart(req.params.cid, req.params.pid)
      res.status(200).send({status: 'succes', payload: await cartService.getCarts()})
  }catch (error){
      res.status(400).send({status: 'error', message: error.message})
  }
})

router.put('/:cid', async (req, res) => {
  try{
      const { products } = req.body
      await cartService.updateCart(req.params.cid, products)
      res.status(200).send({status: 'succes', payload: await cartService.getCarts()})
  }catch(error){
      res.status(400).send({status: 'error', message: error.message})
  }
})

router.put('/:cid/products/:pid', async (req, res) => {
  try{
      const quantity = req.body.quantity
      await cartService.updateQuantity(req.params.cid, req.params.pid, quantity)
      res.status(200).send({status: 'succes', payload: await cartService.getCarts()})
  }catch(error){
      res.status(400).send({status: 'error', message: error.message})
  }
})

router.delete('/:cid/products/:pid', async (req,res) => {
  try{
      await cartService.deleteProductFromCart(req.params.cid, req.params.pid)
      res.status(200).send({status: 'succes', payload: await cartService.getCarts()})
  }catch(error){
      res.status(400).send({status: 'error', message: error.message})
  }
})

router.delete('/:cid', async (req,res) => {
  try{
      await cartService.deleteAllProductsFromCart(req.params.cid)
      res.status(200).send({status: 'succes', payload: await cartService.getCarts()})
  }catch(error){
      res.status(400).send({status: 'error', message: error.message})
  }
})

export { router as cartsRouter }