import express from 'express'
import "dotenv/config"
import "./config/connection.js"
import userRoutes from './routes/userRoutes.js' 
import projectRoutes from './routes/projectRoutes.js' 

const app = express()
const PORT = process.env.PORT;

app.use(express.json())
app.use('/api/users', userRoutes)
app.use('/api/projects', projectRoutes)
app.use('/api/tasks', taskRoutes)
app.get('/', (req, res)=>{
    res.send('Hello World!')
})

app.listen(PORT,()=>{
    console.log(`server listen on http://localhost:${PORT}`);
})