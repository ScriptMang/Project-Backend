import jwt from 'jsonwebtoken'
const secret = process.env.JWT_SECRET; 
export async function authMiddleware(req, res, next) {
    try{
        let token = req.headers.authorization
        if (!token) {
            return res.status(403).json({message: "No token provided"})
        }
        token = token.split(" ").pop().trim()
        const { data }  = jwt.verify(token, secret)
        req.user = data
        
        // move on to the next middleware func
        next()
    }catch(err){
        console.log(err.message)
        res.status(400).json({message: err.message})
    }
}