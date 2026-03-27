import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
   description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    project: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'project',
        required: true
    }
})

const Task = mongoose.model('Task', taskSchema)
export default Task