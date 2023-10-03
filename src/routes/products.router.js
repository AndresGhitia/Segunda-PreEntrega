import RouterClass from "./RouterClass.js";
import productController from "../controllers/products.controller.js";

class ProductRouter extends RouterClass {
    init() {
        this.get('/', ['PUBLIC'], async (req, res) => {
            try {
                console.log('GET / route called'); // Agrega un registro
                res.sendSuccess(await productController.get(req, res));
            } catch (error) {
                console.error('Error in GET /:', error); // Agrega un registro de error
                res.sendServerError(error.message);
            }
        });

        this.get('/:pid', ['PUBLIC'], async (req, res) => {
            try {
                console.log('GET /:pid route called'); // Agrega un registro
                res.sendSuccess(await productController.getById(req, res));
            } catch (error) {
                console.error('Error in GET /:pid:', error); // Agrega un registro de error
                res.sendServerError(error.message);
            }
        });

        this.post('/', ['ADMIN'], async (req, res) => {
            try {
                console.log('POST / route called'); // Agrega un registro
                res.sendSuccess(await productController.create(req, res));
            } catch (error) {
                console.error('Error in POST /:', error); // Agrega un registro de error
                res.sendServerError(error.message);
            }
        });

        this.put('/:pid', ['ADMIN'], async (req, res) => {
            try {
                console.log('PUT /:pid route called'); // Agrega un registro
                res.sendSuccess(await productController.update(req, res));
            } catch (error) {
                console.error('Error in PUT /:pid:', error); // Agrega un registro de error
                res.sendServerError(error.message);
            }
        });

        this.delete('/:pid', ['ADMIN'], async (req, res) => {
            try {
                console.log('DELETE /:pid route called'); // Agrega un registro
                res.sendSuccess(await productController.delete(req, res));
            } catch (error) {
                console.error('Error in DELETE /:pid:', error); // Agrega un registro de error
                res.sendServerError(error.message);
            }
        });
    }
}

export default ProductRouter;
