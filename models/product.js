const mongoose=require('mongoose');
const{ObjectId}=mongoose.Schema
const productSchema=new mongoose.Schema({
    name:{
        type:String,
        require:true,
        maxLength:150,
        trim:true
    },
    description:{
        type:String,
        require:true,
        maxLength:5000,
    },
    price:{
        type:Number,
        require:true,
    },
    quantity:{
        type:Number,
        
    },
    photo:{
        data:Buffer,
        contentType:String
    },
    category:{
        type:mongoose.ObjectId,
        ref:'Category',
        require:true
    },
    shipping:{
        type:Boolean,
        default:false
    },
    sold:{
        type:Number,
        default:0
    }


},{timestamps:true})

productSchema.methods.updateProduct = function (updatedProductData, callback) {
  Object.assign(this, updatedProductData);
  this.save(callback);
};
module.exports=mongoose.model('Product',productSchema);