// aca van las urls de la pagina principal
 // facilita creacion de rutas

const express = require ('express');
const router = express.Router();
 // facilita creacion de rutas
router.get('/',(req,res)=>{
   res.render('../views/index.hbs');//este metodo envia el archivo hbs(html) como respuesta renderisa y responde con el archivo index ../views/index.hbs
}) ;

router.get('/about',(req,res)=>{
    res.render('../views/about.hbs');
    // este metodo envia el archivo hbs(html)
}) ;


module.exports = router;
//cuando visiten pagina principal de la app, envia msj que diga index ...por ahora despues archivos

