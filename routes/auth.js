const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.get("/", async(req,res)=> {
    res.setHeader('Access-Control-Allow-Origin', '*')  ;
    res.setHeader('Access-Controller-Allow-Methods','GET,POST,OPTIONS,PUT,PATCH,DELETE'); 
    res.setHeader('Access-Controller-Allow-Headers','X-Requested-With,content-type');  
    res.setHeader('Access-Control-Allow-Credentials', true) ;    
    res.send("Hello World ");
});

//REGISTER
router.post('/signup', async(req,res)=>{
    try{
        const {username, email, password} = req.body
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        const newUser = new User({username, email, password:hashedPassword})
        const savedUser = await newUser.save()
        res.status(200).json(savedUser)
    }
    catch(err){
        console.error(err)
        res.status(500).json(err)
    }
})

//LOGIN
router.post('/login',async(req,res)=>{
    try {
        const user = User.findOne({email:req.body.email})
        if(!user){
            return res.status(404).json({msg:"User not found"})
        }
        const match = await bcrypt.compare(req.body.password, user.password)
        if(!match){
            return res.status(401).json({msg:"Password does not match"})
        }
        const token = jwt.sign({_id:user._id,username:user.username,email:user.email},process.env.SECRET,{expiresIn:'3d'})
        const {password, ...info} = user._doc
        res.cookie('token',token).status(200).json(info)
    } catch(err) {
        console.error(err)
        res.status(500).json(err)
    }
})

module.exports = router