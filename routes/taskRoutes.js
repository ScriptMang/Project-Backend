import express from 'express'
import Task from '../models/Task.js'
import "dotenv/config"
import {authMiddleware} from '../utils/auth.js'


const router = express.Router({mergeParams: true});
router.use(authMiddleware);

// add a task for route api/projects/:id/tasks
router.post('/', async(req, res)=>{
    try {
        const tasks = await Task.create({
            ...req.body,
            project: req.params.id
        })
        res.status(201).json(tasks)
    }catch(err){
        console.log(err)
        res.status(400).json({message: err.message})
    }
})


// fetch all tasks for route api/projects/:id/tasks
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