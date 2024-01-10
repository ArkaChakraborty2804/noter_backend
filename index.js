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
    res.setHeader('Access-Control-Allow-Origin', '*');
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
// app.post('/login',async(req,res)=>{
//     try {
//         const user = await User.findOne({ email: req.body.email, password: req.body.password });
//         // console.log(user)
//         if(!user){
//             return res.status(404).json({msg:"Incorrect credentials"})
//         }
//         // const match = await bcrypt.compare(req.body.password, password)
//         // console.log(match)
//         // console.log(user.password)
//         // console.log(user)
//         // console.log(user.tree.password)
//         // if(user.password === req.body.password){
//             const token = jwt.sign({_id:user._id,username:user.username,email:user.email},process.env.SECRET,{expiresIn:'3d'})
//             console.log(token)
//             // console.log(token)
//             return res.cookie('token',token).status(200).json({msg:"logged in"})
//         // }
//         // return res.status(401).json({msg:"Password does not match"})
//     } catch(err) {
//         console.error(err)
//         res.status(500).json(err)
//     }
// })

app.post("/login",async (req,res)=>{
    try{
        res.header('Access-Control-Expose-Headers', "Set-Cookie");
        const user=await User.findOne({email:req.body.email})
       
        if(!user){
            return res.status(404).json("User not found!")
        }
        const match=await bcrypt.compare(req.body.password,user.password)
        
        if(!match){
            return res.status(401).json("Wrong credentials!")
        }
        const token=jwt.sign({_id:user._id,username:user.username,email:user.email},process.env.SECRET,{expiresIn:"3d"})
        const {password,...info}=user._doc
        info.token = token
        res.cookie("token",token).status(200).json(info)

    }
    catch(err){
        res.status(500).json(err)
    }
})

app.listen(process.env.PORT,()=>{
    connectDB()
    console.log(`Server running on port ${process.env.PORT}`)
})