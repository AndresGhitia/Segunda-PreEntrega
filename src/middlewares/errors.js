import EErrors from '../utils/CustomErrors/EErrors.js';

function errorHandler(error, req, res, next){
    console.error("Error detected entering the Error Handler");
    console.error(error.cause);
    switch (error.code) {
        case EErrors.INVALID_TYPE_ERROR: 
            res.status(400).send({status: "error", error: error.message});
            break;
        default: 
            res.status(500).send({status: "error", error: "Unhandled error!"});
    }
};

export default errorHandler