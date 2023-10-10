export const generateUserErrorInfo = (user) => {
    return `Una o más propiedades estaban incompletas o no son válidas.
        Lista de propiedades requeridas:
        * first_name: debe ser una cadena, recibido: ${user.first_name}
        * last_name: debe ser una cadena, recibido: ${user.last_name}
        * email: debe ser una cadena, recibido: ${user.email}`;
};

export const generateProductErrorInfo = (product) => {
    return `Una o más propiedades estaban incompletas o no son válidas.
        Lista de propiedades requeridas:
        * code: debe ser una cadena, recibido: ${product.code}
        * title: debe ser una cadena, recibido: ${product.title}
        * price: debe ser una cadena, recibido: ${product.price}
        * stock: debe ser una cadena, recibido: ${product.stock}`;
};
