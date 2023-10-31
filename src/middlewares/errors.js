import EErrors from '../utils/CustomErrors/EErrors.js';
import logger from '../config/logger.js';

function errorHandler(error, req, res, next) {
    logger.error("Error detected entering the Error Handler");
    logger.error(error.cause);
    
    switch (error.code) {
        case EErrors.INVALID_TYPE_ERROR: 
            res.status(400).send({ status: "error", error: error.message });
            break;
        default: 
            // Registra el error desconocido
            logger.error(error);
            
            // Puedes personalizar la respuesta de acuerdo al error desconocido
            res.status(500).send({ status: "error", error: "Error no manejado: " + error.message });
    }
}

export default errorHandler;
