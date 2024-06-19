import dbPost from "./conn"
import { Account, Community } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { token, limit = 10, offset = 0 } = req.body
        const user = new Account(token)
        if (!await user.checkIfExists()){
            throw new Error("Acc not found")
        }
        await user.fetchUnknowns()
        const communReq = await dbPost("SELECT commun FROM communMembers WHERE tag = ?", user.tag);
        const communs = communReq.map(item => item['commun'])
        if (communs.length == 0){
            throw new Error("No communities")
        }
        let postsReq = await dbPost("SELECT * FROM posts WHERE commun IN (?) ORDER BY id DESC LIMIT ? OFFSET ?", [communs, limit, offset]);
        for (let i = 0; i < postsReq.length; i++){
            let post = postsReq[i]
            let base64 = Buffer.from(post["content"]).toString('base64')
            postsReq[i]["content"] = Buffer.from(base64, 'base64').toString('utf-8')
        }
        if (postsReq.length == 0){
            throw new Error("No communities")
        }
        res.status(200).json(postsReq)
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}