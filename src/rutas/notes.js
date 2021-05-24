//url de servidor para crear manejar eliminar nuevas notas etc

// aca van las urls de la pagina principal
const express = require ('express');
const Notas = require('../modelos/Notas.js');
const router = express.Router(); // facilita creacion de rutas
// con los metodos de Nota voy a poder manipular, crear borrar, actualizar...esto seria como una especie de clase
const Nota=require ('../modelos/Notas.js'); //modelo de datos
const {isAuthenticated} = require('../helpers/salida')


router.get('/notes/agregarNota',isAuthenticated,(req,res)=>{ // el req, res se cre para poder mnejar l ruta que cree
    res.render('../views/notas/nuevaNota.hbs') //estaAutenticado comprueba que este logueado para acceder a la ruta, 
    //si es true continua con la sig funcion (next)si no al login para que ingrese
})

// aca creo ruta  para recibir los datos, cada nota que crea el usuario es un objeto Js, async: indica que hay procesos asincronos
router.post('/notes/nuevaNota', isAuthenticated,async(req,res)=>{
     // del objeto que crea la nota le pido que me guarde en una const unicamente el titutlo y descrip
  const {titulo,descripcion}= req.body;
    //validacion de datos ingresados
  const errores = [];
  if(!titulo){
      errores.push({text: 'Tenes que ingresar el titulo para tu tarea'})
  }
  if(!descripcion){
      errores.push({text: 'Dale.. ingresa una descripcion para saber lo que tenes que hacer!! '})
  }
  // si la lista es mayor a 0 = renderiso formulario y muestro errores, le paso titulo y desc para que no vuelva a ingresarlos en el
  //caso de que los haya completado
  if(errores.length>0){
    res.render('../views/notas/nuevaNota.hbs', {
        errores,
        titulo,
        descripcion,
    });
  }else{
  const newNote= new Nota({titulo, descripcion});
  newNote.user = req.user.id; //mantiene ls nots x usuario
  await newNote.save();
  req.flash('success_msg', 'Nota agregada correctamente');// msj con flash
   res.redirect('/notas') //'/notas' es la ruta para ver todas las notas
  }
   
});

//esta va a ser la ruta encargada de consultar todos los datos en la basae de  datos
router.get('/notas',isAuthenticated, async(req, res)=>{
  const notas = await Nota.find({user: req.user.id}).sort({date:'desc'}).lean(); // {user: req.user.id} = trae solo las notas del usuario/// lo guardo en variable para despues poder retornarlo en una lista/ ordenado descendente
  res.render('../views/notas/todas-laslnotas.hbs', {notas}); // envio una vistas y paso objeto notas resultado del find, muestra la vista con todas las notas
})

//editar las notas
router.get('/notes/edit/:id',isAuthenticated, async (req, res)=>{
  // consulto base de datos para traer el formulario a editar req.params.id
  const note = await Nota.findById(req.params.id); // me da la nta segun el id enviado como parametro
res.render('../views/notas/editar-notas.hbs', {note});
});

//actualizo los datos, esta es la ruta '/notes/edit-note/:id' que edita las notas segun el id que le envio por parametros
router.put('/notes/edit-note/:id', isAuthenticated,async(req, res)=>{
  const {titulo, descripcion} = req.body;
  await Nota.findByIdAndUpdate(req.params.id, {titulo,descripcion}) //busco por el id y actualizo con las parametros pedidos al body
  req.flash('success_msg', 'Nota actualizada correctamente'); // msj con flash
  res.redirect('/notas') // luego de editar redirecciono a la vista de tods las notas

});

//esta es la ruta del id que quiero borrar metodo delete
router.delete('/notes/delete/:id', isAuthenticated, async (req, res)=>{
 await Nota.findByIdAndDelete(req.params.id); // busca y elimina el id
 req.flash('success_msg', 'Nota eliminada correctamente');
 res.redirect('/notas');
  
} );



module.exports = router;