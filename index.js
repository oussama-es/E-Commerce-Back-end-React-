const express = require('express');
const cors=require('cors')

const mongoose = require('mongoose');
const expressValidator=require('express-validator')
const cookieParser=require('cookie-parser')

const authRoutes=require('./routes/auth')
const userRoutes=require('./routes/users')
const categoryRoutes=require('./routes/categories')
const productRoutes=require('./routes/products')
const braintreeRoutes=require('./routes/braintree')
const orderRoutes=require('./routes/orders')


const app = express();
require('dotenv').config();
mongoose.set('useCreateIndex', true);//pass

//Db mongoDB
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true ,// Add this option for the new MongoDB driver

    useFindAndModify: false // Add this line

}).then(() => console.log('db connected'))
.catch(error => console.log('db connection error:', error));

//Middlewares
app.use(express.json())
app.use(expressValidator.apply())
app.use(cors());

app.use(cookieParser())

//Routes Middleware
app.use('/api',authRoutes)
app.use('/api/user',userRoutes)
app.use('/api/category',categoryRoutes)
app.use('/api/product',productRoutes)
app.use('/api/brainTree',braintreeRoutes)
app.use('/api/order',orderRoutes)



const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`app is running on port ${port}`));
