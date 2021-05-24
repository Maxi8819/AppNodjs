const  Mongoose  = require("mongoose")
// reuiero solo el squema
const{Schema} = Mongoose;
// aca voy a definir las propiedades/squemas de las notas
const NoteSchema = new Schema({
    titulo: {type: String, require: true}, // titulo va a ser string , requerido
    descripcion: {type: String, require: true},
    daate:{type: Date, default: Date.now},
    user:{type: String}
})
//utliza desde moongose el modelo 
module.exports=Mongoose.model('Nota', NoteSchema)