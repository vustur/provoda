import dbPost from "./conn"
import { Post, Account, Community } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { token, postid } = req.body
        const user = new Account(token)
        if (!await user.checkIfExists()){
            throw new Error("Acc not found")
        }
        await user.fetchUnknowns()
        const post = new Post(user.tag, null, null, null, null, postid)
        if (!await post.checkIfExists()){
            throw new Error("Post not found")
        }
        await post.fetchUnknowns()
        if (user.tag != post.authortag){
            const role = await user.getRole(post.commun)
            if (role != 'owner' && role != 'mod') {
                throw new Error("Post not yours or no permissions")
            }
        }
        await post.delete()
        res.status(200).json('succ')
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}