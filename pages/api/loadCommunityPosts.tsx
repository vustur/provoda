import dbPost from "./conn"
import { Community } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { token, commun, limit = 10, offset = 0 } = req.body
        const community = new Community(commun)
        if (!await community.checkIfExists()){
            throw new Error("Community not found")
        }
        let postsReq = await dbPost("SELECT * FROM posts WHERE commun = ? ORDER BY id DESC LIMIT ? OFFSET ?", [commun, limit, offset]);
        for (let i = 0; i < postsReq.length; i++){
            let post = postsReq[i]
            let base64 = Buffer.from(post["content"]).toString('base64')
            postsReq[i]["content"] = Buffer.from(base64, 'base64').toString('utf-8')
        }
        if (postsReq.length == 0){
            throw new Error("No posts")
        }
        res.status(200).json(postsReq)
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}