import { promises as fs } from 'fs';

class CartManagerFile {
    constructor() {
        this.filename = './src/dao/filesystem/data/carts.json'
        this.initializeFile()
    }

    async initializeFile() {
        try {
            await fs.access(this.filename);
        } catch (error) {
            await fs.writeFile(this.filename, '[]');
        }
    }

    async saveCarts(carts) {
        try {
            const data = JSON.stringify(carts);
            await fs.writeFile(this.filename, data, 'utf-8');
        } catch (error) {
            throw new Error('Error al guardar carritos:', error);
        }
    }

    async createCart() {
        try {
            const carts = await this.getCarts();
            const newCart = {
                id: carts.length + 1,
                products: []
            };
            carts.push(newCart);
            await this.saveCarts(carts);
            return newCart;
        } catch (error) {
            throw new Error('Error al crear carrito:', error);
        }
    }

    async getCarts() {
        try {
            const data = await fs.readFile(this.filename, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            throw new Error('Error al obtener carritos:', error);
        }
    }

    async getCartById(cid) {
        try {
            const carts = await this.getCarts();
            return carts.find(cart => cart.id === cid);
        } catch (error) {
            throw new Error('Error al obtener carrito por ID:', error);
        }
    }

    async addProductToCart(cid, pid) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === cid);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            const existingProduct = cart.products.find(prod => prod.id === pid);
            if (existingProduct) {
                existingProduct.quantity += 1;
            } else {
                const product = { id: pid, quantity: 1 };
                cart.products.push(product);
            }
            await this.saveCarts(carts);
            return cart;
        } catch (error) {
            throw new Error('Error al agregar producto al carrito:', error);
        }
    }

    async deleteProductFromCart(cid, pid) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === cid);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            cart.products = cart.products.filter(product => product.id !== pid);
            await this.saveCarts(carts);
            return cart;
        } catch (error) {
            throw new Error('Error al eliminar producto del carrito:', error);
        }
    }

    async updateCart(cid, products) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === cid);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            cart.products = products;
            await this.saveCarts(carts);
            return cart;
        } catch (error) {
            throw new Error('Error al actualizar el carrito:', error);
        }
    }

    async updateQuantity(cid, pid, quantity) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === cid);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            const product = cart.products.find(prod => prod.id === pid);
            if (!product) {
                throw new Error('Producto no encontrado en el carrito');
            }
            product.quantity = quantity;
            await this.saveCarts(carts);
            return cart;
        } catch (error) {
            throw new Error('Error al actualizar las cantidades:', error);
        }
    }

    async deleteAllProductsFromCart(cid) {
        try {
            const carts = await this.getCarts();
            const cart = carts.find(cart => cart.id === cid);
            if (!cart) {
                throw new Error('Carrito no encontrado');
            }
            cart.products = [];
            await this.saveCarts(carts);
            return cart;
        } catch (error) {
            throw new Error('Error al eliminar todos los productos del carrito:', error);
        }
    }
}

export default CartManagerFile