// coneccion base de dato
//configuraciones para utilizar mongoose
const mongoose = require ('mongoose');
mongoose.connect('mongodb://localhost/notes-db-app',{
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    
}) 



//  verificacion coneccion
 .then(db=>console.log('DB esta conectada'))
 .catch(err => console.error(err)) // si hay un erro decime cual esa
