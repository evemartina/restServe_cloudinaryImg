
const { v4: uuidv4 } = require('uuid');
const path = require('path')

const subirArchivos = (files,ext_validas=['jpg','png','gif','jpeg'],carpeta='')=>{
    return new Promise((resolve,reject) =>{

        const {archivo} = files;
        const nom_ext   = archivo.name.split('.');
        const extension = nom_ext[nom_ext.length -1].toLowerCase();

        if(!ext_validas.includes(extension)){
            return reject(`Extencion ${extension} no permitida ,${ext_validas}`);
       }

        const temp_name  = uuidv4()+'.'+extension;
        const uploadPath = path.join(__dirname , '../uploads/', carpeta,temp_name);

        archivo.mv(uploadPath, (err) =>{
            if (err) {
                console.log(err)
               return reject(err);
            }
            return resolve( temp_name);
        });
    });
}



module.exports = {
    subirArchivos,

}