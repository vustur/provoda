import dbPost from "./conn"
import { Post } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { id } = req.body
        const post = new Post(null, null, null, null, null, id)
        if (!await post.checkIfExists()){
            throw new Error("Not found")
        }
        await post.fetchUnknowns()
        res.status(200).json(post)
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}