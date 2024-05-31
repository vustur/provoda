import dbPost from "./conn"
import { Account, Post, Comment } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { token, postid, text, attach = null } = req.body
        const user = new Account(token)
        const post = new Post(null, null, null, null, null, postid)
        if (!await user.checkIfExists()){
            throw new Error("Acc not found")
        }
        await user.fetchUnknows()
        if (!await post.checkIfExists()){
            throw new Error("Post not found")
        }
        await post.fetchUnknowns()
        if (await user.checkIfBannedFrom(post.commun)){
            throw new Error("Acc is banned from this community")
        }
        const comment = new Comment(null, postid, user.tag, text, attach, null, null)
        await comment.create()
        res.status(200).json('succ')
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}