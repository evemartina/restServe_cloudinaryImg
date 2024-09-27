
const dbValidator  = require('./db-validators');
const generaJWT    = require('./generar-jwt');
const googleVerify = require('./google-verify');
const subirArchivos = require('./subirArchivo');


module.exports ={
    ...dbValidator ,
    ...generaJWT   ,
    ...googleVerify,
    ...subirArchivos,
}

