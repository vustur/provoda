import dbPost from "./conn"
import { Post, Account } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        let role
        const { id, token } = req.body
        const post = new Post(null, null, null, null, null, id)
        if (!await post.checkIfExists()){
            throw new Error("Not found")
        }
        await post.fetchUnknowns()
        if (token != null){
            const user = new Account(token)
            if (!await user.checkIfExists()){
                throw new Error("Acc not found")
            }
            await user.fetchUnknows()
            role = await user.getRole(post.commun)
        }
        res.status(200).json({post, role})
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}