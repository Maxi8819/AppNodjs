// acceder a url para autenticarse / crear, registrarse etc
// aca van las urls de la pagina principal
const express = require ('express');
const { serializeUser } = require('passport');
const router = express.Router(); // facilita creacion de rutas
// importo modulo de Usuarios BD
 const Usuario = require ('../modelos/Usuarios.js');
const passport = require ('passport');



router.get('/users/ingresar',(req,res)=>{
    res.render('../views/usuarios/ingresar.hbs')
});

// aca se autentica el usuario
router.post('/users/ingresar', passport.authenticate('local',{
    successRedirect: '/notas',
    failureRedirect: '/users/ingresar',
    failureFlash:true
})); // aplica la autenticacion de pasaje - >passport.use(new estrategiaLocal


router.get('/users/registro',(req,res)=>{
    res.render('../views/usuarios/registrarse.hbs')
});

//rut especial para recibir los datos
router.post('/users/registro', async (req,res) => {
 const {name,email,password,confirm_password}=req.body;
 const errors=[];
 if(name.length<=0) {
     errors.push({text: 'El nombre no puede estar vacio'})
 }
 if(password.length<=0) {
    errors.push({text: 'La password no puede estar vacio'})
}
 if (password!=confirm_password){
     errors.push({text: 'password no coinciden, verificar'});
 }
 if (password.length<4){
    errors.push({text: 'password debe ser al menos mayor a 4 caracteres'});
 }
 if(errors.length>0){
     res.render('../views/usuarios/registrarse.hbs', {errors,name,email,password,confirm_password});
 }else{
//validacion de que el email no este repetido
const emailDeUsuario = await Usuario.findOne({email:email});
if(emailDeUsuario) {
    req.flash('error_msg' , 'Este email ya se encuentra registrado')
    res.redirect('/users/registro');

}
// par guardar los dtos armo un nuevo shchema en models, si la pass cumple con los otros filtros, creo usuario:
const nuevoUsu = new Usuario({name,email, password});
nuevoUsu.password = await nuevoUsu.encriptarPass(password); // guarda la pass encriptada
await nuevoUsu.save();
//mando msj
req.flash('success_msg', 'Estas registrado');
res.redirect('/users/ingresar');
 }
});

//aca con un metod de passport, terminamos la sesion
router.get('/users/salir', (req, res)=>{
    req.logOut();
    res.redirect('/');
});


module.exports = router;