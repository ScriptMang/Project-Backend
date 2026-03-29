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
        res.status(201).json(projs)
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


//get an existing target project
router.get('/:id', async(req, res) => {
    try{
        const proj = await Project.findById(req.params.id)
        if (req.user._id != proj.user) {
            console.log("Is this an object id: ", req.params.id);
            return res.status(403).json({message: 'User forbidden from updating this project'});
        }
        // This needs an authorization check
        if (!proj) {
        return res.status(404).json({ message: 'No project found with this id!' });
        }
        res.status(200).json(proj)
        }catch(err){
            console.log(err.message)
            res.status(400).json({message: err.message})
        }
})


//get an existing target project
router.put('/:id', async(req, res) => {
    try{
        // get all the projects for the user (you can filter based on logged in user {author: req.user._id})
        const proj = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true })
                                .sort({_id: 1})
                                .populate('user', 'username')
    
        if (req.user._id != proj.user ){
          return res.status(403).json({message: 'User forbidden from updating this project'})
        }
        
        if (!proj) {
          return res.status(404).json({ message: 'No project found with this id!' });
        }
        res.status(200).json(proj);
    }catch(err){
        console.log(err.message)
        res.status(500).json({message: err.message})
    }
})

router.delete('/:id', async(req, res) => {
    try {
    const proj = await Project.findById(req.params.id);
    if (req.user._id != proj.user) {
      return res.status(403).json({message: 'User forbidden from updating this project'});
    }
    // This needs an authorization check
    if (!proj) {
      return res.status(404).json({ message: 'No project found with this id!' });
    }
    proj.deleteOne({_id: req.params.id});
    res.json({ message: 'Project deleted!' });
  } catch (err) {
    res.status(500).json(err);
  }
})





export default router;