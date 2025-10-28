// add=(a,b)=>a+b
// sub=(a,b)=>a-b
// mul=(a,b)=>a*b
// div=(a,b)=>a/b

// module.exports={add,sub,mul,div}
// lf=require('./prac')
// eventemitter=require('events').EventEmitter
// emitob=new eventemitter()

// emitob.on('onlog',(msg)=>{ lf(msg)})
// emitob.emit('onlog',"my message")

path=require('path')

console.log(path.parse('./prac'))

module.export= function add(x,y){
    return x+y;
}
module.export= function sub(x,y){
    return x-y;
}
module.export= function mul(x,y){
    return x*y;
}

