const express=require('express')
const { salam,signup, signin, signout}=require('../controllers/authController')
const router=express.Router();
const { userSignUpValidator}=require('../middlewares/userValidator')
const {requireSignIn}=require('../middlewares/auth')

router.get('/',salam);

router.post('/signup',userSignUpValidator,signup);
router.post('/signin',signin);
router.get('/signout',signout);
router.get('/hello',(req,res)=>{
    res.send("hello THere")
});

module.exports=router;