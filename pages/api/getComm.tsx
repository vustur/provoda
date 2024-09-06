import dbPost from "./conn"
import { Account, Post, Comment } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { commid } = req.body
        const commnt = new Comment(commid)
        if (!await commnt.checkIfExists()){
            throw new Error("Comment not found")
        }
        const dbReq = await dbPost("SELECT * FROM comments WHERE id = ?", [commid]);
        res.status(200).json(dbReq)
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}