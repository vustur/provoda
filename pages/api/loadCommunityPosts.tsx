import dbPost from "./conn"
import { Account, Community } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { token, commun, limit = 10, offset = 0 } = req.body
        const user = new Account(token)
        if (!await user.checkIfExists()){
            throw new Error("Acc not found")
        }
        const community = new Community(commun)
        if (!await community.checkIfExists()){
            throw new Error("Community not found")
        }
        const postsReq = await dbPost("SELECT * FROM posts WHERE commun = ? ORDER BY date DESC LIMIT ? OFFSET ?", [commun, limit, offset]);
        if (postsReq.length == 0){
            throw new Error("No posts")
        }
        res.status(200).json(postsReq)
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}