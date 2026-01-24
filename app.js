const express=require('express');
const app=express();
const path=require('path');

const db=require('./config/mongoose-connection.js');
const ownersRouter=require('./routes/ownersRouter.js');
const usersRouter=require('./routes/usersRouter.js');
const productsRouter=require('./routes/productsRouter.js');

const cookieParser=require('cookie-parser');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,'public')));

app.set("view engine",'ejs');

app.use(cookieParser());

//sending on routers
app.use('/owners',ownersRouter);
app.use('/users',usersRouter);
app.use('/products',productsRouter);

app.listen(3000);
