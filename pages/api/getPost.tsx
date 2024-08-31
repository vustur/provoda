import dbPost from "./conn"
import { Post, Account, postsParser } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { id, token } = req.body
        const post = new Post(null, null, null, null, null, id)
        if (!await post.checkIfExists()){
            throw new Error("Not found")
        }
        await post.fetchUnknowns()
        let user = new Account(token)
        if (await user.checkIfExists()){
            await user.fetchUnknowns()
        } else {
            user = null
        }
        const parsedPosts = await postsParser([{ ...post }], user)
        res.status(200).json(parsedPosts[0])
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}