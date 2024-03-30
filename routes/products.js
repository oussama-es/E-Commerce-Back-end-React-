const express=require('express');

const router=express.Router();

const { createProduct,showProduct,productById, removeProduct,updateProduct, allProducts,relatedProduct, SearchProduct, photoProduct } = require('../controllers/productController');
const { requireSignIN, isAuth, isAdmin } = require('../middlewares/auth');
const { userById } = require('../middlewares/user');


const upload = require('../middlewares/mutler');


router.get('/:productId',showProduct)

router.post('/search',SearchProduct)


router.get('/related/:productId',relatedProduct)

router.get('/photo/:productId',photoProduct)

router.get('/',allProducts)

router.delete('/:productId/:userId',[requireSignIN,isAuth,isAdmin],removeProduct)
//router.put('/:productId/:userId',[requireSignIN,isAuth,isAdmin],updateProduct)
router.put('/product/:productId', upload.single('productImage'), updateProduct);


router.post('/create/:userId',[requireSignIN,isAuth,isAdmin],createProduct)

router.param('userId',userById)
router.param('productId',productById)


module.exports=router;