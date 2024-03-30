const Product = require("../models/product"); // Utilisez "Product" en majuscule

exports.decreaseQuantity = (req, res, next) => {
    let bulkOps = req.body.products.map(product => {
        return {
            updateOne: {
                filter: { _id: product._id },
                update: { $inc: { quantity: -product.count, sold: +product.count } }
            }
        };
    });

    Product.bulkWrite(bulkOps, (err, products) => { // Utilisez "Product" en majuscule
        if (err) {
            return res.status(400).json({ error: 'Could not Update Product !' });
        }
        next();
    });
};
