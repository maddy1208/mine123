export const error_middleware=function(err,req,res,next){

    return res.status(err.statuscode||500).send(err.message||"Something went wrong")
}