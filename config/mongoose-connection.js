const mongoose=require('mongoose');
//npm i debug=>to write
// and also set value DEBUG=development:*

const dbgr=require('debug')("development:mongoose")
const config=require('config');

//config automatically works on the basis of envrionment variable
mongoose.connect(`${config.get("MONGODB_URI")}/scratch`)   //use config so require config and npm i config
.then(()=>{
    dbgr("connected");

})
.catch((err)=>{
  dbgr(err);
})

module.exports=mongoose.connection;