export const validate_schema={

name:{
    notEmpty:{
        errorMessage:"User name must not be empty"
    },
    isLength:{
             options:{min:5,max:12},
             errorMessage:"must be 5 length"
    },
    isString:{
        errorMessage:"must be string"

    }
},
age:{
    notEmpty:{
        errorMessage:"age must not be empty"
    },
  
    isInt:{
        options:{min:18,max:100},
        errorMessage:"must be number and above 18"

    }
}

}