import { promises as fs } from 'fs';

class ProductManagerFile {
    constructor() {
        this.filename = './src/dao/filesystem/data/products.json'
        this.initializeFile();
    }

    async initializeFile() {
        try {
            await fs.access(this.filename);
        } catch (error) {
            await fs.writeFile(this.filename, '[]');
        }
    }

    async getProducts(query, options) {
        try {
            const data = await fs.readFile(this.filename, 'utf8');
            const products = JSON.parse(data);
            return products;
        } catch (error) {
            throw new Error('Error al leer el archivo de productos:', error);
        }
    }

    async getProductById(pid) {
        try {
            const data = await fs.readFile(this.filename, 'utf8');
            const products = JSON.parse(data);
            return products.find(product => product.id === pid);
        } catch (error) {
            throw new Error('Error al leer el archivo de productos:', error);
        }
    }

    async addProduct(product) {
        try {
            const data = await fs.readFile(this.filename, 'utf8');
            const products = JSON.parse(data);

            const isRepeated = products.some(productSaved => productSaved.code === product.code);
            if (isRepeated) {
                throw new Error("Código de producto duplicado");
            }

            if (!isRepeated && product.title && product.description && product.code && product.price && product.stock && product.category) {
                products.push({
                    id: products.length + 1,
                    title: product.title,
                    description: product.description,
                    code: product.code,
                    price: product.price,
                    status: product.status === false ? false : true,
                    stock: product.stock,
                    category: product.category,
                    thumbnails: product.thumbnails == null ? [] : product.thumbnails
                });

                await fs.writeFile(this.filename, JSON.stringify(products));
            } else {
                throw new Error("Se requiere agregar algunos datos para añadir este producto");
            }
        } catch (error) {
            throw new Error('Error al agregar producto:', error);
        }
    }

    async updateProduct(pid, updatedProduct) {
        try {
            const data = await fs.readFile(this.filename, 'utf8');
            const products = JSON.parse(data);
            const productToUpdate = products.find(product => product.id === pid);

            if (productToUpdate) {
                const isRepeated = products.some(productSaved => productSaved.code === updatedProduct.code);
                if (!isRepeated) {
                    const updatedProducts = products.map(product => {
                        if (product.id === pid) {
                            return { ...product, ...updatedProduct };
                        }
                        return product;
                    });

                    await fs.writeFile(this.filename, JSON.stringify(updatedProducts));
                } else {
                    throw new Error("Ya existe un producto con el código: " + updatedProduct.code);
                }
            } else {
                throw new Error("No existe un producto con el id: " + pid);
            }
        } catch (error) {
            throw new Error('Error al actualizar producto:', error);
        }
    }

    async deleteProduct(pid) {
        try {
            const data = await fs.readFile(this.filename, 'utf8');
            const products = JSON.parse(data);
            const productToDelete = products.find(product => product.id === pid);

            if (productToDelete) {
                const updatedProducts = products.filter(product => product.id !== pid);
                await fs.writeFile(this.filename, JSON.stringify(updatedProducts));
            } else {
                throw new Error("No existe un producto con el id: " + pid);
            }
        } catch (error) {
            throw new Error('Error al eliminar producto:', error);
        }
    }
}

export default ProductManagerFile