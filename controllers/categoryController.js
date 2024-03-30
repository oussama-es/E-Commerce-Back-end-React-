const Category=require('../models/category');
const Product = require('../models/product'); // Assurez-vous de spécifier le chemin correct vers votre modèle de produit

// Le reste de votre code de contrôleur ici...

exports.creatCategory=(req,res)=>{

    const category=new Category(req.body);

    category.save((err,category)=>{
        if(err){
            return res.status(400).json({
                error :'bad Request !'
            })
        }

        res.json({
            category:category
        })
    }
        
    )
}
exports.categoryId=(req,res,next,id)=>{
    Category.findById(id).exec((err,category)=>{
        if(err||!category){
            return res.status(404).json({
                error:'Category not Found'
            })
        }

        req.category=category
        next();
    })
}
exports.showCategory=(req,res)=>{

    res.json({
        category:req.category
    })
}

exports.updateCategory=(req,res)=>{

    let category =req.category

    category.name=req.body.name;

    category.save((err,category)=> {
        if(err)
        {
            return res.status(400).json({
                error:"bad request"
            })
          
        }
        res.json({
            category,
            message:"Category updated"
        })
    })

}
exports.deleteCategory = (req, res) => {
    let category = req.category;

    // Vérifiez d'abord si des produits sont associés à cette catégorie
    Product.find({ category: category._id }, (err, products) => {
        if (err) {
            return res.status(500).json({
                error: "Une erreur s'est produite lors de la recherche de produits associés à cette catégorie."
            });
        }
        if (products.length > 0) {
            // Si des produits sont associés à cette catégorie, renvoyez un message d'erreur approprié
            return res.status(400).json({
                error: "Cette catégorie ne peut pas être supprimée car elle est associée à des produits existants."
            });
        }

        // Si aucune erreur n'est survenue et qu'aucun produit n'est associé à la catégorie, supprimez la catégorie
        category.remove((err, category) => {
            if (err) {
                return res.status(500).json({
                    error: "Une erreur s'est produite lors de la suppression de la catégorie."
                });
            }
            res.status(204).json({
                message: "Catégorie supprimée avec succès."
            });
        });
    });
};
  

exports.allCategories=(req,res)=>{
    Category.find().exec((err,categories)=>{
        if(err){
            return res.status(500).json({
                error:err
            })
        }

        res.json({
            categories
        })
    })
}