import dbPost from "./conn"
import { Account, Post } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { token, postid, isPositive, mode = 'add' } = req.body
        if (mode != 'add' && mode != 'remove'){
            throw new Error("Wrong mode (add and remove only allowed)")
        }
        const user = new Account(token)
        if (!await user.checkIfExists()){
            throw new Error("Acc not found")
        }
        await user.fetchUnknowns()
        const post = new Post(user.tag, null, null, null, null, postid)
        if (!await post.checkIfExists()){
            throw new Error("Post not found")
        }
        if (mode == 'add'){
            await post.changeReput(isPositive.toString(), user.tag)
        }
        if (mode == 'remove'){
            await post.deleteReput(user.tag)
        }
        await post.fetchUnknowns() // here its refreshes reputation values
        res.status(200).json([post.reputation])
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}
