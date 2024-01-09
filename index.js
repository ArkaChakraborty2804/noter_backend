const express = require('express')
const dotenv = require('dotenv')

dotenv.config()

const app = express()

app.get('/',(req,res)=>{
    res.status(200).json({
        msg: "Working"
    })
})

app.listen(process.env.PORT,()=>{
    console.log(`Server running on port ${process.env.PORT}`)
})