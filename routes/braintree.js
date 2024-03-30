const express=require('express');
const router =express.Router();


const { requireSignIN,isAuth, isAdmin } = require('../middlewares/auth');

const {generateToken,processPayment}=require('./../controllers/brainController');


const {userById}=require('../middlewares/user');






router.get('/getToken/:userId',[requireSignIN,isAuth],generateToken);
router.post('/purchase/:userId',[requireSignIN,isAuth],processPayment);

router.param('userId',userById)

module.exports=router
