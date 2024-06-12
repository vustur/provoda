import dbPost from "./conn"
const bcrypt = require("bcrypt")
import { Account } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { tag } = req.body
        const user = new Account(null, tag)
        if (!await user.checkIfExists()){
            throw new Error("Acc not found")
        }
        let   postReq = await dbPost("SELECT * FROM posts WHERE authortag = ? ORDER BY date DESC", [tag]);
        const commReq = await dbPost("SELECT * FROM comments WHERE authortag = ? ORDER BY date DESC", [tag]);
        for (let i = 0; i < postReq.length; i++){
            let post = postReq[i]
            let base64 = Buffer.from(post["content"]).toString('base64')
            postReq[i]["content"] = Buffer.from(base64, 'base64').toString('utf-8')
        }
        if (postReq.length == 0 && commReq.length == 0){
            throw new Error("No content")
        }
        res.status(200).json({posts : postReq, comments : commReq})
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}