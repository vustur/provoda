import dbPost from "./conn"
import { Post, Account, Comment } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { token, commid, isPositive, mode = 'add' } = req.body
        if (mode != 'add' && mode != 'remove'){
            throw new Error("Wrong mode (add and remove only allowed)")
        }
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
        const post = new Post(user.tag, null, null, null, null, commnt.authortag)
        if (!await post.checkIfExists()){
            throw new Error("Post not found")
        }
        if (mode == 'add'){
            await commnt.changeReput(isPositive, user.tag)
        }
        if (mode == 'remove'){
            await commnt.deleteReput(user.tag)
        }
        await commnt.fetchUnknowns()
        res.status(200).json([post.reputation])
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}