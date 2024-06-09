import dbPost from "./conn"
import { Post, Account, Comment } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { token, commid } = req.body
        const user = new Account(token)
        if (!await user.checkIfExists()){
            throw new Error("Acc not found")
        }
        await user.fetchUnknows()
        const commnt = new Comment(commid)
        if (!await commnt.checkIfExists()){
            throw new Error("Comment not found")
        }
        await commnt.fetchUnknowns()
        const post = new Post(user.tag, null, null, null, null, commnt.postid)
        if (!await post.checkIfExists()){
            throw new Error("Post not found")
        }
        await post.fetchUnknowns()
        if (user.tag != commnt.authortag){
            const role = await user.getRole(post.commun)
            if ((role != 'owner' && role != 'mod')) {
                throw new Error("Comment not yours or no permissions")
            }
        }
        await commnt.delete()
        res.status(200).json('succ')
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}