import mongoose from "mongoose";
import validator from 'validator'

const  data_schema=new mongoose.Schema({

    name:{ type: String, 
        required: [true,"Name is required"]
    },
    email:{
        type: String,
        required: [true,"Email is required"],
unique:true,
       validator:[validator.isEmail,"PLease enter valid email"]
    },
    occupation:{ type: String, 
        required: [true,"Occupation is required"]
    },
 address:{ type: String, 
        required: [true,"Address is required"]
    },
    phone_number:{
        type: Number,
        required: [true,"Mobile number is required"]
    }
})


export const data_model=mongoose.model("data",data_schema)