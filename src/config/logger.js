import objectConfig from "./objectConfig.js";
import winston from "winston";

export const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        http: 'green',
        debug: 'magenta'
    }
};

const devLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    format: winston.format.combine(
        winston.format.colorize({ colors: customLevelOptions.colors }),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({
            level: "debug",
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'error',
        })
    ]
});

const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    format: winston.format.combine(
        winston.format.colorize({ colors: customLevelOptions.colors }),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console({
            level: "info",
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'error',
        })
    ]
});

const addLogger = (req, res, next) => {
    if (objectConfig.environment === 'production'){
        req.logger = prodLogger;
    }else{
        req.logger = devLogger;
    }
    req.logger.http(`${req.method} in ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    next();
}

let logger = objectConfig.environment === 'production' ? prodLogger : devLogger;

export { addLogger, logger };
