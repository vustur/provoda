import dbPost from "./conn"
const bcrypt = require("bcrypt")
import { Account, postsParser, commsParser } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { reqToken, tag } = req.body
        const searchUser = new Account(null, tag)
        if (!await searchUser.checkIfExists()){
            throw new Error("Acc not found")
        }
        let postReq = await dbPost("SELECT * FROM posts WHERE authortag = ? ORDER BY date DESC", [tag]);
        let commReq = await dbPost("SELECT * FROM comments WHERE authortag = ? ORDER BY date DESC", [tag]);
        if (postReq.length == 0 && commReq.length == 0){
            throw new Error("No content")
        }
        let posts = await postsParser(postReq)
        let comments = await commsParser(commReq)
        res.status(200).json({posts, comments})
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}