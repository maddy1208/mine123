import { custom_err } from "../helper/error_handler.js"
import { data_model } from "../model/data_model.js"

export const get_data=async function (req,res,next){

    const all_data=await data_model.find()
    return res.json({success:true,data:all_data})
}
export const get_single_data=async function (req,res,next){

    const single_data=await data_model.findById(req.params.id||"")
    if(!single_data){ return next("Product not found",404)}

    return res.json({success:true,data:single_data})
}
export const post_data=async function (req,res,next){
     if(!req.body){ return next(new custom_err("Please enter valid details",400))}

     const {name,email,occupation,address,phone_number}=req.body
     const new_data={name,email,occupation,address,phone_number}
     console.log(new_data)
     const result=await data_model.create(new_data)
     return res.status(200).send({success:true,msg:"fetched successfully",data:result})

}
export const patch_data=async function (req,res,next){
     if(!req.body){ return next(new custom_err("Please enter valid details",400))}
     if(!req.params.id){ return next(new custom_err("Id needed for update",400))}


     const result=await data_model.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
     return res.status(201).send({success:true,"msg":"updated successfully",data:result})
}
import mongoose from "mongoose";

export const delete_data = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      return next(new custom_err("ID is required", 400));
    }

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new custom_err("Invalid ID format", 400));
    }

    const result = await data_model.findByIdAndDelete(id);

    if (!result) {
      return next(new custom_err("Data not found", 404));
    }

    return res.status(200).json({
      success: true,
      msg: "Data deleted successfully",
    });

  } catch (err) {
    next(err);
  }
};
