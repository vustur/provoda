import dbPost from "./conn"
import { Post, Account, Comment } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { token, commid, isPositive, mode = 'add' } = req.body
        if (mode != 'add' && mode != 'remove'){
            throw new Error("Wrong mode (add and remove only allowed)")
        }
        const user = new Account(token)
        if (!await user.checkIfExists()){
            throw new Error("Acc not found")
        }
        await user.fetchUnknowns()
        const commnt = new Comment(commid)
        if (!await commnt.checkIfExists()){
            throw new Error("Comment not found")
        }
        await commnt.fetchUnknowns()
        if (isPositive != true && isPositive != false){
            throw new Error("isPositive is invalid")
        }
        if (mode == 'add'){
            await commnt.changeReput(isPositive.toString(), user.tag)
        }
        if (mode == 'remove'){
            await commnt.deleteReput(user.tag)
        }
        await commnt.fetchUnknowns()
        res.status(200).json([commnt.reputation])
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}