import express from 'express'
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import "dotenv/config"
import jwt from 'jsonwebtoken'

const router = express.Router()
const secret = process.env.JWT_SECRET 
const expiration = '24h'
router.post('/register', async(req, res) => {
     try {
         // hash the pswd
        const hashedPassword= await bcrypt.hash(req.body.password, Number(process.env.SALT_ROUNDS));
        const user = await User.create({
            ...req.body,
            password: hashedPassword
        })
      
        // create a token
        const payload = {
            username: user.username,
            email: user.email,
            _id: user._id 
        }
        const token = jwt.sign({data: payload}, secret, {expiresIn: expiration})
        res.status(201).json({token, user})
    }catch(err){
        console.log(err.message)
        res.status(400).json({message: err.message})
    }
})

router.post('/login', async (req, res) => {
    try{
        // find the user
        const user = await User.findOne({email: req.body.email })

        // check if the user exists
        // you want to be vague about whether its email or pswd
        if (!user) {
            return res.status(400).json({message: 'Incorrect email or password'}) 
        }

        // check the password
        const correctPswd = await bcrypt.compare(req.body.password, user.password)
        if (!correctPswd) {
            return res.status(400).json({message: 'Incorrect email or password'})
        }
        // create the token
        const payload = {
            username: user.username,
            email: user.email,
            _id: user._id 
        }
        const token = jwt.sign({data: payload}, secret, {expiresIn: expiration})
        res.status(201).json({token, user})
    }catch(err){
        console.log(err.message)
        res.status(400).json({message: err.message})
    }
})


export default router