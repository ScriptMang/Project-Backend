import express from 'express'
import Task from '../models/Task.js'
import "dotenv/config"
import {authMiddleware} from '../utils/auth.js'

const router = express.Router();
router.use(authMiddleware);

// add a task
router.post('/', async(req, res)=>{
    try {
        const tasks = await Task.create({
            ...req.body,
            user: req.user._id
        })
        await tasks.populate('user','username')
        res.status(201).json(tasks)
    }catch(err){
        console.log(err)
        res.status(400).json({message: err.message})
    }
})


// fetch all tasks
router.get('/', async(req, res) => {
    try{
        // get all the projects for the user (you can filter based on logged in user {author: req.user._id})
        const tasks = await Task.find({ user: {$eq: req.user._id}})
                                .sort({_id: 1})
                                .populate('user', 'username')
        res.status(200).json(tasks)
    }catch(err){
        console.log(err.message)
        res.status(400).json({message: err.message})
    }
})


//get an existing target task
router.get('/:id', async(req, res) => {
    try{
        const task = await Task.findById(req.params.id)
        if (req.user._id != task.user) {
            console.log("Is this an object id: ", req.params.id);
            return res.status(403).json({message: 'User forbidden from updating this task'});
        }
        // This needs an authorization check
        if (!task) {
        return res.status(404).json({ message: 'No task found with this id!' });
        }
        res.status(200).json(task)
        }catch(err){
            console.log(err.message)
            res.status(400).json({message: err.message})
        }
})


//get an existing target task
router.put('/:id', async(req, res) => {
    try{
        // get all the projects for the user (you can filter based on logged in user {author: req.user._id}
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' })

        if (req.user._id != task.user ){
          return res.status(403).json({message: 'User forbidden from updating this task'})
        }
        
        if (!task) {
          return res.status(404).json({ message: 'No task found with this id!' });
        }
        res.status(200).json(task);
    }catch(err){
        console.log(err.message)
        res.status(500).json({message: err.message})
    }
})

// delete a task
router.delete('/:id', async(req, res) => {
    try {
    // This needs an authorization check
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'No task found with this id!' });
    }
    res.json({ message: 'Task deleted!' });
  } catch (err) {
    res.status(500).json(err);
  }
})





export default router;