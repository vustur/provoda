import dbPost from "./conn"
import { Post, Account, Community } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { token, postid, textContent } = req.body
        const user = new Account(token)
        if (!await user.checkIfExists()){
            throw new Error("Acc not found")
        }
        await user.fetchUnknowns()
        const post = new Post(user.tag, null, null, null, null, postid)
        if (!post.checkIfExists()){
            throw new Error("Post not found")
        }
        if (textContent == null){
            throw new Error("Wrong content")
        }
        if (textContent.length > 4000){
            throw new Error("Content too long (max 100 chars for title and 4000 chars for content)")
        }
        if (textContent.length < 10){
            throw new Error("Content too short (min 3 chars for title and 10 chars for content)")
        }
        await post.fetchUnknowns()
        await post.editTextContent(textContent)
        res.status(200).json('succ')
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}