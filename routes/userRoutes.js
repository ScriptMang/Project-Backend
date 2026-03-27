import express from 'express'
import User from '../models/User.js'
import bcrypt from 'bcrypt'
import "dotenv/config"
import jwt from 'jsonwebtoken'

const router = express.Router()
const secret = process.env.JWT_SECRET 
const expiration = '24h'
router.get('/api/users/register', async(req, res) => {
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

export default router