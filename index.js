const express = require('express')
const dotenv = require('dotenv')
const app = express()
const cors = require('cors')
const mongoose=require('mongoose')
const authRoute = require('./routes/auth')
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
app.use(cors({origin:'https://noter-frontend.vercel.app/',credentials:true}))
app.use(cookieParser())
app.use("/api/auth",authRoute)

app.listen(process.env.PORT,()=>{
    connectDB()
    console.log(`Server running on port ${process.env.PORT}`)
})