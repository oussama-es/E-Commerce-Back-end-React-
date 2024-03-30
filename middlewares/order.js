const { Order } = require("../models/order")

exports.orderById=(req,res,next,id)=>{

    Order.findById(id)
        .exec((err,order)=>{
            if(err || !order){
                return res.status(400).json({error :'order not found !'})
            }
            req.order=order
        })
        next()
}