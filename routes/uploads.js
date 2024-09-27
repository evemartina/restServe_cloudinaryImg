const { Router }             = require('express');
const {check}                = require('express-validator');
const { colectionPermit }    = require('../helpers');
const { validarCampos, validarArchivoSubir } = require('../middlewares');
const { uploadArchivos, actualizarImagen , cargarImagen, actualizarImagenCloudinary}   = require('../controllers/uploads');

const router = Router();

router.post('/',  validarArchivoSubir,uploadArchivos);

router.put('/:colection/:id', [
    validarArchivoSubir,
    check('id','el id debe ser un mongo id').isMongoId(),
    check('colection').custom(c => {  colectionPermit( c,['usuarios','productos']); return true;}),
    validarCampos
], actualizarImagenCloudinary
// actualizarImagen
);

router.get('/:colection/:id', [    
    check('id','el id debe ser un mongo id').isMongoId(),
    check('colection').custom(c => {  colectionPermit( c,['usuarios','productos']); return true;}),
    validarCampos
], cargarImagen);


module.exports = router;