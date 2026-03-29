import express from 'express'
import Project from '../models/Project.js'
import "dotenv/config"
import {authMiddleware} from '../utils/auth.js'

const router = express.Router();
router.use(authMiddleware);

// add a project
router.post('/', async(req, res)=>{
    try {
        const projs = await Project.create({
            ...req.body,
            user: req.user._id
        })
        await projs.populate('user','username')
        res.status(200).json(projs)
    }catch(err){
        console.log(err)
        res.status(400).json({message: err.message})
    }
})


// fetch all projects
router.get('/', async(req, res) => {
    try{
        // get all the projects for the user (you can filter based on logged in user {author: req.user._id})
        const projs = await Project.find({ user: {$eq: req.user._id}})
                                .sort({_id: 1})
                                .populate('user', 'username')
        res.status(200).json(projs)
    }catch(err){
        console.log(err.message)
        res.status(400).json({message: err.message})
    }
})

export default router;