const helper = {};
helper.isAuthenticated = (req, res,next) =>{
    if(req.isAuthenticated()) {// isAthenticated es funcion de passport, si esta logueado true, si no logue = false
        return next(); //si esta logueado le retorno next para que continue con la sig funcion
    }
    // si no esta logueado mando msj de no autorizado y redirecciono a login
    req.flash('error_msg', 'No autorizado')
    res.redirect('/users/ingresar');
}; //aca compruebo si existe la sesion

module.exports = helper;