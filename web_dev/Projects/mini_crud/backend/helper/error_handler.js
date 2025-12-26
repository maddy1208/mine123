export class custom_err extends Error{


    constructor(message,statuscode){
    super(message);
    this.statuscode=statuscode; 
    this.name="custom handle error"}
   // Error.captureStackTrace(this,custom_error)



}