const Product = require('../models/product');
const fs = require('fs');
const formidable = require('formidable');
const Joi =require('joi');
const _=require('lodash');
const product = require('../models/product');

exports.createProduct = (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
  
    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: 'Image could not be uploaded!'
        });
      }
  
      let product = new Product(fields);
  
      if (files.photo) {
        if (files.photo.size > Math.pow(10, 6)) {
          return res.status(400).json({
            error: 'Image should be less than 1mb in size !'
          });
        }
        product.photo.data = fs.readFileSync(files.photo.path);
        product.photo.contentType = files.photo.type;
      }
  
      const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        price: Joi.required(),
        quantity: Joi.required(),
        category: Joi.required(),
        shipping: Joi.required(),
      });
  
      const { error } = schema.validate(fields);
  
      if (error) {
        return res.status(400).json({
          error: error.details[0].message
        });
      }
  
      product.save((err, product) => {
        if (err) {
          return res.status(400).json({
            error: 'Product not persisted'
          });
        }
        res.json({
          product
        });
      });
    });
  };
  

exports.productById=(req,res,next,id)=>{

    Product.findById(id).exec((err,product)=>{
        if(err||!product){
            return res.status(404).json({
                error:'Product not Found'    
            })
            
        }

        req.product=product;
        next();        
    })
}

/*
exports.showProduct=(req,res)=>{

    req.product.photo=undefined;

    res.json({
        product:req.product
    })
}*/

exports.showProduct = (req, res) => {
    const product = req.product;
    
    Product.findById(product._id)
        .populate('category', 'name') // Demandez de charger la catégorie avec le champ 'name'
        .exec((err, productWithCategory) => {
            if (err || !productWithCategory) {
                return res.status(400).json({
                    error: 'Product not found'
                });
            }

            productWithCategory.photo = undefined;

            res.json({
                product: productWithCategory
            });
        });
};


exports.removeProduct = (req, res) => {
    let product = req.product;
  

    
    product.remove((err, deletedProduct) => {
      if (err) {
        return res.status(500).json({
          error: "An error occurred while deleting the product"
        });
      }
  
      res.status(200).json({
        message: "Product deleted successfully",
        deletedProduct: deletedProduct // Ajoutez le produit supprimé à la réponse
      });
    });
  };/*
exports.updateProduct = (req, res) => {
   console.log('PUT request to /product/:productId/:userId');
  console.log('Product ID:', req.params.productId);
  console.log('User ID:', req.params.userId);
  console.log('Request Body:', req.body);

      let form = new formidable.IncomingForm();
  
      form.keepExtensions = true;
  
      form.parse(req, (err, fields, files) => {
  
          if(err) {
              return res.status(400).json({
                  error: 'Image could not uploaded !'
              })
          }
  
  
          let product = req.product;
          
          product = _.extend(product, fields)
  
  
          if(files.photo) {
             
              if(files.photo.size > Math.pow(10, 6)) {
                  return res.status(400).json({
                      error: 'Image should be less than 1mb in size !'
                  })
              }
  
              product.photo.data = fs.readFileSync(files.photo.path)
              product.photo.contentType = files.photo.type
          }
  
          const schema = Joi.object({
              name: Joi.string().required(),
              description: Joi.string().required(),
              price: Joi.required(),
              quantity: Joi.required(),
              category: Joi.required(),
              shipping: Joi.boolean().required(), // Maintenant, shipping est traité comme une valeur booléenne


          })
  
          const { error } = schema.validate(fields);
  
          if(error) {
              return res.status(400).json({
                  error: error.details[0].message
              })
          }
  
          product.save((err, updatedProduct) => {
            if (err) {
              return res.status(400).json({
                error: 'Erreur lors de la mise à jour du produit'
              });
            }
            res.json({ updatedProduct });
          });
          
  
      })
  }
*/

// ... Autres routes et fonctions
//marche bien
/*
exports.updateProduct = (req, res) => {
  const productId = req.params.productId;
  const updatedProductData = req.body;

  // Récupérez le produit à mettre à jour par son ID
  Product.findById(productId, (err, product) => {
    if (err) {
      return res.status(400).json({ error: 'Le produit n\'a pas pu être trouvé' });
    }

    // Mettez à jour les champs du produit avec les données mises à jour
    product.name = updatedProductData.name;
    product.description = updatedProductData.description;
    product.price = updatedProductData.price;
    product.quantity = updatedProductData.quantity;
    product.category = updatedProductData.category;
    product.shipping = updatedProductData.shipping;

    // Enregistrez le produit mis à jour dans la base de données
    product.save((err, updatedProduct) => {
      if (err) {
        return res.status(400).json({ error: 'Erreur lors de la mise à jour du produit' });
      }
      res.json({ success: true, updatedProduct });
    });
  });
};*/



// Route de mise à jour de produit avec image
exports.updateProductWithImage = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "L'image n'a pas pu être téléchargée !"
      });
    }

    // Récupérez les données du produit depuis les champs du formulaire
    const { name, description, price, quantity, category, shipping } = fields;
    const productId = req.params.productId;

    // Recherchez le produit par son ID
    Product.findById(productId, (err, product) => {
      if (err || !product) {
        return res.status(400).json({
          error: "Le produit n'a pas pu être trouvé"
        });
      }

      // Mettez à jour les propriétés du produit
      product.name = name;
      product.description = description;
      product.price = price;
      product.quantity = quantity;
      product.category = category;
      product.shipping = shipping;

      // Si une nouvelle image est fournie, mettez à jour l'image du produit
      if (files.photo) {
        if (files.photo.size > Math.pow(10, 6)) {
          return res.status(400).json({
            error: "L'image doit être inférieure à 1 Mo !"
          });
        }
        product.photo.data = fs.readFileSync(files.photo.path);
        product.photo.contentType = files.photo.type;
      }

      // Enregistrez le produit mis à jour dans la base de données
      product.save((err, updatedProduct) => {
        if (err) {
          return res.status(400).json({
            error: 'Erreur lors de la mise à jour du produit'
          });
        }
        res.json(updatedProduct);
      });
    });
  });
};





/*










// I


exports.updateProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not be uploaded!',
      });
    }

    let product = req.product;
    product = _.extend(product, fields);

    if (files.image) {
      if (files.image.size > Math.pow(10, 6)) {
        return res.status(400).json({
          error: 'Image should be less than 1mb in size!',
        });
      }

      product.photo.data = fs.readFileSync(files.image.path);
      product.photo.contentType = files.image.type;
    }

    const schema = Joi.object({
      name: Joi.string().required(),
      description: Joi.string().required(),
      price: Joi.number().required(),
      quantity: Joi.number().required(),
      category: Joi.string().required(),
      shipping: Joi.boolean().required(),
    });

    const { error } = schema.validate(fields);

    if (error) {
      return res.status(400).json({
        error: error.details[0].message,
      });
    }

    product.save((err, updatedProduct) => {
      if (err) {
        return res.status(400).json({
          error: 'Erreur lors de la mise à jour du produit',
        });
      }
      res.json({ success: true, updatedProduct });
    });
  });
};*/
// Autres routes et fonctions ...

exports.allProducts=(req,res)=>{

    let sortBy=req.query.sortBy ? req.query.sortBy:'_id';
    let order=req.query.order ? req.query.order:'asc';
    let limit=req.query.limit ? parseInt(req.query.limit) :6; 


    let query={}

    let { search , category}=req.query;

    if (search) {
        query.name = { $regex: search, $options: 'i' };
    }

    if (category){
        query.category=category;

    }
    
    Product.find(query).
            select("-photo")
            .populate('category')
            .sort([[sortBy,order]])
            .limit(limit)
            .exec((err,products)=>{

                if(err){
                    return res.status(404).json({
                        error:"Product not found"
                    })
                }

                res.json({
                    products
                })
            })

}

exports.relatedProduct = (req, res) => {
    
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find({category: req.product.category, _id: { $ne: req.product._id }})
           .limit(limit)
           .select('-photo')
           .populate('category', '_id name')
           .exec((err, products) => {

                if(err) {
                    return res.status(404).json({
                        error: "Products not found !"
                    })
                }

                res.json({
                    products
                })

           })

}



exports.SearchProduct = (req, res) => {

    let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    let order = req.query.order ? req.query.order : 'asc';
    let limit = req.body.limit ? parseInt(req.query.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};
    

    for (let key in req.body.filters) {
        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
           .select("-photo")
           .populate('category')
           .sort([[sortBy, order]])
           .limit(limit)
           .skip(skip)
           .exec((err, products) => {

              if(err) {
                  return res.status(404).json({
                      error: "Products not found !"
                  })
              }

              res.json({
                  products
              })
           })

}


exports.photoProduct = (req, res) => {

    const { data, contentType } = req.product.photo;

    if(data) {

        res.set('Content-Type', contentType)

        return res.send(data)

    }

}

