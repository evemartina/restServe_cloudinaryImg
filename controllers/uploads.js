const { response } = require('express');
const path         = require('path');
const fs           = require('fs');
const cloudinary   = require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL)

const {subirArchivos}       = require('../helpers');
const { Usuario, Producto } = require('../models');

const uploadArchivos = async (req , res=response ) =>{

    if ((!req.files || Object.keys(req.files).length === 0 )|| !req.files.archivo ) {
        res.status(400).send('No files were uploaded.');
        return;
    }

    try {

        const nombre = await subirArchivos(req.files);
        res.json({
            nombre
        })
    } catch (msg) {
        res.status(400).json({
            msg
        })
    }
}

const actualizarImagen = async( req , res=response ) =>{

    const { id,colection } = req.params;
    let modelo;

    switch (colection) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return  res.status(400).json({
                    msg:`No se existe el Usuario con el id: ${id}`
                })
            }
            break;
            case 'productos':
                modelo = await Producto.findById(id);
                if(!modelo){
                    return  res.status(400).json({
                        msg:`No se existe el producto con el id: ${id}`
                    })
                }
                break;

        default:
            break;
    }
    if(modelo.img){
        const pathImg = path.join(__dirname,'../uploads',colection,modelo.img)
        if(fs.existsSync(pathImg)){
            fs.unlinkSync(pathImg);
        }
    }
    const nombre = await subirArchivos( req.files, undefined, colection );
    modelo.img = nombre;
    await modelo.save()


    res.json({
        modelo
    });

}

const actualizarImagenCloudinary = async( req , res=response ) =>{

    const { id,colection } = req.params;
    let modelo;

    switch (colection) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return  res.status(400).json({
                    msg:`No se existe el Usuario con el id: ${id}`
                })
            }
            break;
            case 'productos':
                modelo = await Producto.findById(id);
                if(!modelo){
                    return  res.status(400).json({
                        msg:`No se existe el producto con el id: ${id}`
                    })
                }
                break;

        default:
            break;
    }

    if(modelo.img){
        const nombre_arr  = modelo.img.split('/');
        const nombre      = nombre_arr[nombre_arr.length - 1 ];
        const [public_id] = nombre.split('.');

        await cloudinary.uploader.destroy( public_id);

    }

    const {tempFilePath} = req.files.archivo;
    const {secure_url}   = await cloudinary.uploader.upload(tempFilePath);
    modelo.img           = secure_url;
    await modelo.save()


    res.json({
        modelo
    });

}

const cargarImagen = async ( req , res = response) => {
    const { id,colection } = req.params;
    let modelo;

    switch (colection) {
        case 'usuarios':
            modelo = await Usuario.findById(id);
            if(!modelo){
                return  res.status(400).json({
                    msg:`No se existe el Usuario con el id: ${id}`
                })
            }
            break;
        case 'productos':
            modelo = await Producto.findById(id);
            if(!modelo){
                return  res.status(400).json({
                    msg:`No se existe el producto con el id: ${id}`
                })
            }
            break;

        default:
            break;
    }
    if(modelo.img){
        const pathImg = path.join(__dirname,'../uploads',colection,modelo.img)
        if(fs.existsSync(pathImg)){
            return res.sendFile(pathImg);
        }
    }

    const defauImg = path.join(__dirname,'../assets/default.jpg');
    return res.sendFile( defauImg);


}

module.exports = {
    uploadArchivos,
    actualizarImagen,
    cargarImagen,
    actualizarImagenCloudinary
}