const mongoose = require ('mongoose');
//importo squema
const {Schema} = mongoose;
// importo modulo encriptador
const bcrypt = require ('bcryptjs');

//creo nuevo squema, lo guardo en la variable UserSchema para poder reutilizarlo

const UserSchema = new Schema ({
    name:{type: String, require:true},
    email:{type: String, require:true},
    password:{type: String, require:true},
    date:{type: Date, default:Date.now}, // mongoo guarda tmb la fecha cuando crea id
});


// 2:21
//bcrypt puede ser asincrono, metodo que cifra y retorna pass cifrada

UserSchema.methods.encriptarPass= async (password)=>{
const salt =  await  bcrypt.genSalt(10); // genera hash aplicado 10 vces
const hash = bcrypt.hash(password, salt );
return hash;
};

//bcrypt tmb da la posibilidad de comparar las pass que ingresa el usu y la cifrada, vuelve a cifrar y compara con lo que 
//que tengo almacenado en la Base de Datos
UserSchema.methods.compararPass = async function (password){
     return await bcrypt.compare(password, this.password);
}


module.exports = mongoose.model('Usuario', UserSchema ); // Usuario: nombre de modelo