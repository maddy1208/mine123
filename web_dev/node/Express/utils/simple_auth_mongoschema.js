const mongoose=require('mongoose')
const validateschema=mongoose.Schema({

    name:{
        type:mongoose.SchemaTypes.String,
        required:true,
        unique: true

    },
    password:{
        type:mongoose.SchemaTypes.String,
        require: true
    }
})
    
module.exports=mongoose.model("users",validateschema)


