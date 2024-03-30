const express =require('express')
const { getOneUser,updateOneUser}=require('../controllers/userControlleur');
const { userById } = require('../middlewares/user');
const { requireSignIN,isAuth, isAdmin } = require('../middlewares/auth');


const router=express.Router();

router.get('/profile/:userId',requireSignIN,isAuth,getOneUser)

router.put('/profile/:userId',requireSignIN,isAuth,updateOneUser)


router.param('userId',userById)
module.exports=router;
