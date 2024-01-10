const express = require('express')
const dotenv = require('dotenv')
const app = express()
const cors = require('cors')
const mongoose=require('mongoose')
const User = require('./models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser')

const connectDB =async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL,{dbName:'test'})
        console.log("database is connected successfully!")
    }
    catch(err){
        console.error(err)
        console.log(err)
    }
}

dotenv.config()
app.use(express.json())
app.use(cookieParser())
// app.use("/api/auth",authRoute)
app.use(cors({origin:'*' ,
 methods: "GET,HEAD,PUT,PATCH,POST,DELETE", 
 preflightContinue: false , 
 optionsSuccessStatus: 204}));
app.use(express.json());

app.get("/", async(req,res)=> {
    res.setHeader('Access-Control-Allow-Origin', '*')  ;
    res.setHeader('Access-Controller-Allow-Methods','GET,POST,OPTIONS,PUT,PATCH,DELETE'); 
    res.setHeader('Access-Controller-Allow-Headers','X-Requested-With,content-type');  
    res.setHeader('Access-Control-Allow-Credentials', true) ;    
    res.send("Hello World ");
});

//REGISTER
app.post('/signup', async(req,res)=>{
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
app.post('/login',async(req,res)=>{
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
        res.cookie('token',token).status(200).json({msg:"logged in"})
    } catch(err) {
        console.error(err)
        res.status(500).json(err)
    }
})

app.listen(process.env.PORT,()=>{
    connectDB()
    console.log(`Server running on port ${process.env.PORT}`)
})