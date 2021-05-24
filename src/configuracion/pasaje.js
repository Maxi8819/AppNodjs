//los paquetes passport, permiten utenticar el usurio, confirma si puede ingresar y guarda los datos en una sesion 

const passport = require ('passport'); // utiliza el modulo almacenado en una constante
const estrategiaLocal = require('passport-local').Strategy; // autenticacion local unicamene estartegia
const Usuario = require('../modelos/Usuarios.js');


//nueva estrategia de autenticacion:// esto la define para despues usar en una ruta
passport.use(new estrategiaLocal({
    usernameField:'email' //  atravez de que se autentica el usuario
}, async(email, password, listo) =>{ //  funcion recibe los dtos que autentica y un callback par terminr con la autenticacion
    // aca adentro empiezo a verificar en la BD los datos ingresdos--> por esto requiero el modelo de usuarios
     const user = await Usuario.findOne({email:email}); // lo guardo en variable usuario comparo el email y lo comparo con el dado por parametro
     if (!user){ // si no existe un usuario en la BD, el correo no es valido
        return listo(null, false,{message: 'Usuario no encontrado'}) // null para el usuario, false para el error, msj

     } else{ // si encuentra el usuario, valido la contrase
       const coincide =await user.compararPass(password);
       if (coincide){
           return listo (null, user);
       }else{
        return listo(null, false,{message: 'Password incorrecta'})
       }

     }
} ));

// almacenar sesion 

passport.serializeUser((user, listo)=> { //toma usuario y callback
        listo(null, user.id); // null pork no hay error , y almaceno en una sesion el id del usuario para que en proximas sesiones no se pida el login
}); 

passport.deserializeUser((id, listo)=>{
    Usuario.findById(id,(err, user) =>{ // si hay un usuario en la sesion voy a buscar por id ese usuario
        //si lo encuetro puedo tener err o el user, si lo encuentro lo retorno con el callback
        listo (err, user);
    } );
});