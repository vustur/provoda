import dbPost from "./conn"
import { Account, Post } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { postid } = req.body
        const post = new Post(null, null, null, null, null, postid)
        if (!await post.checkIfExists()){
            throw new Error("Post not found")
        }
        const dbReq = await dbPost("SELECT * FROM comments WHERE postId = ? ORDER BY reputation DESC", [postid]);
        res.status(200).json([dbReq])
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}