import dbPost from "./conn"
import { Account, Post, Comment } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { token, commid, text } = req.body
        const user = new Account(token)
        if (!await user.checkIfExists()){
            throw new Error("Acc not found")
        }
        const commnt = new Comment(commid)
        if (!await commnt.checkIfExists()){
            throw new Error("Comment not found")
        }
        if (commnt.authortag != user.tag){
            throw new Error("You cant edit this comment, its not yours. Why you even trying?")
        }
        commnt.text = text
        await commnt.edit()
        res.status(200).json("succ")
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}