import dbPost from "./conn"
import { Post, Account, Comment } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        let role
        const { commid, token } = req.body
        const comment = new Comment(commid)
        if (!await comment.checkIfExists()){
            throw new Error("Comment not found")
        }
        await comment.fetchUnknowns()
        const post = new Post(null, null, null, null, null, comment.postid)
        if (!await post.checkIfExists()){
            throw new Error("Post not found")
        }
        await post.fetchUnknowns()
        const user = new Account(token)
        if (!await user.checkIfExists()){
            throw new Error("Acc not found")
        }
        await user.fetchUnknows()
        role = await user.getRole(post.commun)
        res.status(200).json(role)
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}