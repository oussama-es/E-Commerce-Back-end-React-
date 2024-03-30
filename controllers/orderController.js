const { Order } = require("../models/order");


exports.create = (req, res) => {
    req.body = {
        ...req.body,
        user: req.profile
    };

    console.log("Received data for creating order:", req.body); // Ajoutez cette ligne pour afficher les données reçues

    const order = new Order(req.body);
    order.save((err, data) => {
        if (err) {
            return res.status(400).json({ error: err });
        }
        res.json(data);
    });
};



exports.listOrders=(req,res)=>{

    Order.find()
        .populate('user','_id name email')
        .sort('-createdAt')
        .exec((err,orders)=>{
            if(err){
                return res.status(400).json({error:err.message})

            }
            res.json(orders);
        })

}

exports.getStatus=(req,res)=>{

    res.json({status:Order.schema.path('status').enumValues})
}
exports.updateOrderStatus=(req,res)=>{
    Order.update(
        {_id:req.order._id},
        {$set:{status:req.body.status}},
        (err,data)=>{
            if(err){
                return res.status(400).json({error:err.message})

            }
            res.json(data)
        }
    )
}