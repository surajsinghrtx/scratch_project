//require("dotenv") it will require dotenv
//.config() will go to .env file and save all variables into process.env
require('dotenv').config();  //npm i dotenv ,npm i config => to fetch variable


const express=require('express');
const app=express();
const path=require('path');

const expressSession=require('express-session')  // for the flash (install both packages)
const flash=require('connect-flash')

const db=require('./config/mongoose-connection.js');
const ownersRouter=require('./routes/ownersRouter.js');
const usersRouter=require('./routes/usersRouter.js');
const productsRouter=require('./routes/productsRouter.js');
const index=require('./routes/index.js');

const cookieParser=require('cookie-parser');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'public')));

app.set("view engine",'ejs');

app.use(cookieParser());

//for the flash
app.use(
expressSession({
    resave:false,
    saveUninitialized:false,
    secret:process.env.EXPRESS_SESSION_SECRET,
})
);
app.use(flash());

//sending on routers
app.use('/owners',ownersRouter);
app.use('/users',usersRouter);
app.use('/products',productsRouter);
app.use('/',index);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
