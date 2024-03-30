exports.userSignUpValidator=(req,res,next)=>{

    req.check('name','name is Required').notEmpty()
    req.check('email').isEmail();
    req.check('password','Password is Required')
        .notEmpty()
        .isLength({min:5,max:10})
        .withMessage('Password must between 6 and 10 caracters')
         
    const errors=req.validationErrors()
    
    if(errors){
            return res.status(400).json({errors:errors[0].msg})

    }

    next()
}