import dbPost from "./conn"
import { Post, Account, Community } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { token, commun, content } = req.body
        const user = new Account(token)
        const community = new Community(commun)
        if (!await user.checkIfExists()){
            throw new Error("Acc not found")
        }
        await user.fetchUnknows()
        if (!await community.checkIfExists()){
            throw new Error("Community not found")
        }
        if (await community.checkIfBanned(user.tag)){
            throw new Error("Acc is banned from this community")
        }
        const post = new Post(user.tag, commun, null, null, content)
        await post.create()
        res.status(200).json('succ')
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}