import express from 'express'
import Project from '../models/Project.js'
import "dotenv/config"
import authMiddleware from '../utils/auth.js'

const router = express.Router();
app.use(authMiddleware);

// fetch all projects
router.get('/api/projects', async(req, res) => {
    try{
        // get all the projects for the user 
        const projs = await Project.find({})
                                .populate('user', 'username')
        res.status(200).json(projs)
    }catch(err){
        console.log(err.message)
        res.status(400).json({message: err.message})
    }
})
