// add=(a,b)=>a+b
// sub=(a,b)=>a-b
// mul=(a,b)=>a*b
// div=(a,b)=>a/b

// module.exports={add,sub,mul,div}
lf=require('./prac')
eventemitter=require('events').EventEmitter
emitob=new eventemitter()

emitob.on('onlog',(msg)=>{ lf(msg)})
emitob.emit('onlog',"my message")

