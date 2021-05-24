const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const { mainModule } = require('process');
const methodOverride = require('method-override');
const sesion = require('express-session'); // guardo los datos de usuarios atraves de una sesion
const flash=  require ('connect-flash'); // manda msjs entre multiples vistas siempre despues del express--session
const { use } = require('./rutas/notes');
//validaciones de usuarios
const passport = require('passport'); // voy a middlewares 2:45

// inicializzaciones
const app = express(); 
require('./database');
require('./configuracion/pasaje')// para autenticacion

// configuraciones
app.set('port',process.env.PORT||3000); //configuracion del puerto si existe puerto en mi pc que lo utilice, si no vms con el 3000

app.set('views', path.join(__dirname,'views'));// une directorios /  concatena con carpeta vistas. le paso ubicacion vistsa
//app.set('views', path.join(process.cwd() + '/views'));
app.engine('.hbs',exphbs({//.hbs nombre que le damos a los archivos de las vistas // exphbs es una funcion y adentro le doy un abjeto de configuracion  
defaultLayout:'main', //con las propiedades (defaultLayout:,layoutsDir: partialsDir:, extname:) sirven para saver de que manera utilizamos las vistas
runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
}, // esto me permite usar datos de handlebars como parametros

layoutsDir: path.join(app.get('views'),'layouts'), // obten direccion de vistas y concatenala con loyout
partialsDir: path.join(app.get('views'),'partials'), // html que se puede reutilizar//obten direccion de vistas y concatenala con partial
extname:'.hbs',  //que extension va a tener nuestros archivos html
})); 
//app.set('view engine','.hbs'); //  configura motor de vistas  con el .hbs --- >este tiro error<-----

app.set('views', path.join(__dirname, 'views')); //configura motor de vistas  con el .hbs


// middlewares

app.use(express.urlencoded({extended:false})) //  sirve para que cuando un formulario me envie datos/ pueda entenderlo/extended:false para que solo acepte datos
app.use(methodOverride('_method')); // para que utilice methodOverride// sirve para que los formularios puedan enviar otros metodos que no sean solo
// get y post, sino tmb como put y delete
app.use(sesion({
    secret: 'mysecretapp',
    resave: true,
    saveUninitialized: true,
}));//dentro le doy un objeto de configuracion //con las propiedades//permite autenticar usuario
// passport siempre despues del sesion
app.use(passport.initialize());
app.use(passport.session());
// flash despues d passport
app.use(flash());


//variables globales
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg') // success_msg se lama y guarda los msj que mande atarvez de flash con el nmbre
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error') 
    res.locals.user = req.user|| null; // con passport asi obtenemos los datos del usuario
   next(); 
})    // para que todas las vistas accedan al msj,  variable global que almacena msj flash

//rutas // url

app.use(require('./rutas/index'));//  con esto le hago saber al servidor donde estan mis rutas
app.use(require('./rutas/notes'));//  con esto le hago saber al servidor donde estan mis rutas
app.use(require('./rutas/users')); //  con esto le hago saber al servidor donde estan mis rutas

// archivos estaticos

app.use(express.static(path.join(__dirname, 'public'))); // paso la direccion de la carpera public


//inicio servidor
app.listen(app.get('port'), ()=>{
    console.log('servidor OK', app.get('port'));
}) // inicializa servidor

