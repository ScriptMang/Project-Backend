import express from 'express'
import "dotenv/config"

const app = express()
const PORT = process.env.PORT;

app.use(express.json())

app.get('/', (req, res)=>{
    res.send('Hello World!')
})

app.listen(PORT,()=>{
    console.log(`server listen on http://localhost:${PORT}`);
})