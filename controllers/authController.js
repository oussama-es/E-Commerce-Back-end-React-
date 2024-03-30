const User=require('../models/user');
const jwt =require('jsonwebtoken');

exports.salam=(req,res)=>{
    res.send({message:'users module'})
}

exports.signup=(req,res)=>{


    const user=new User(req.body);

    user.save((err,user)=>{
        if(err){
            return res.status(400).send(err)
        }

        res.send(user)
    })
}
/*
// Utilisation de Promesses avec .save()
exports.signup = async (req, res) => {
    try {
      // Créer un nouvel utilisateur
      const newUser = new User(req.body);
  
      // Utiliser la méthode .save() avec Promesse
      const savedUser = await newUser.save();
  
      // Répondre à la demande avec les données sauvegardées de l'utilisateur
      res.status(201).json(savedUser);
    } catch (error) {
      // Gérer l'erreur
      res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
    }
  };*/
  
exports.signin=(req,res)=>{
    const {
        email,password
    }=req.body

    User.findOne({email},(err,user)=>{
       if(err || !user) {
            return res.status(400).json({
                errors:'User not found with this email ,Please SignUp!'
            })
        }

        if (!user.authenticate(password)){
            return res.status(401).json({
                    error:'Email and Password dont Match !'
            })

        }
        const token= jwt.sign({_id:user._id,role:user.role},process.env.JWT_SECRET);
    
        res.cookie('token',token,{expire: new Date()+8000000})
  

        const {_id,name,email,role}=user;

        return res.json({
            token,user:{_id,name,email,role}
        })
    })
  }

exports.signout=(req,res)=>{
  res.clearCookie('token');
  res.json({
    message:"User SignOut"
  })
}