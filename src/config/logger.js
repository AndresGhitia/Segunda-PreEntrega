import winston from "winston";

const customLevelOptions = {
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
}

const devLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console(
            {
                level: "debug",
                format: winston.format.combine(
                    winston.format.colorize({ all: true, colors: customLevelOptions.colors }),
                    winston.format.simple()
                )
            }
        ),
        new winston.transports.File({
            filename: './errors.log',
            level: 'error',
            format: winston.format.simple()
        })
    ]
})

const prodLogger = winston.createLogger({
    levels: customLevelOptions.levels,
    transports: [
        new winston.transports.Console(
            {
                level: "info",
                format: winston.format.combine(
                    winston.format.colorize({ all: true, colors: customLevelOptions.colors }),
                    winston.format.simple()
                )
            }
        ),
        new winston.transports.File({
            filename: './errors.log',
            level: 'error',
            format: winston.format.simple()
        })
    ]
})

export const addLogger = (req, res, next) => {
    if (objectConfig.environment === 'production') {
        req.logger = prodLogger;
    } else {
        req.logger = devLogger;
    }
    req.logger.http(`${req.method} in ${req.url} - at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    next();
}

const objectConfig = {
    environment: 'development' 
};

let logger;
if (objectConfig.environment === 'production') {
    logger = prodLogger;
} else {
    logger = devLogger;
}

export default logger;
