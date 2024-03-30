const express=require('express');

const router=express.Router();

const { creatCategory, showCategory, categoryId, updateCategory, deleteCategory, allCategories } = require('../controllers/categoryController');
const { requireSignIN, isAuth, isAdmin } = require('../middlewares/auth');
const { userById } = require('../middlewares/user');

router.get('/',allCategories);




router.post('/create/:userId',[requireSignIN,isAuth,isAdmin],creatCategory)

router.put('/:categoryId/:userId',[requireSignIN,isAuth,isAdmin],updateCategory)

router.delete('/:categoryId/:userId',[requireSignIN,isAuth,isAdmin],deleteCategory)


router.get('/:categoryId',showCategory);

router.param('userId',userById)
router.param('categoryId',categoryId)

module.exports=router;