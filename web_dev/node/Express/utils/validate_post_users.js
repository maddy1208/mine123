const validate_post_user_schema={

name:{
    notEmpty:{
        errorMessage:"User name must not be empty"
    },
  
    isString:{
        errorMessage:"must be string"

    }
},
password:{
    notEmpty:{
        errorMessage:"pass must not be empty"
    },
    
  
    
}

}

module.exports={validate_post_user_schema}