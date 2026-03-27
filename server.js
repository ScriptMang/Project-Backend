import express from 'express'
import "dotenv/config"
import userRoutes from './routes/User.js' 

const app = express()
const PORT = process.env.PORT;

app.use(express.json())
app.use('/api/users', userRoutes)
app.get('/', (req, res)=>{
    res.send('Hello World!')
})

app.listen(PORT,()=>{
    console.log(`server listen on http://localhost:${PORT}`);
})