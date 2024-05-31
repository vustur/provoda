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
        const postReq = await dbPost("SELECT id, commun, title, text, reputation, date FROM posts WHERE authortag = ? ORDER BY date DESC", [tag]);
        const commReq = await dbPost("SELECT id, postId, text, reputation, date FROM comments WHERE authortag = ? ORDER BY date DESC", [tag]);
        res.status(200).json([postReq, commReq])
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}