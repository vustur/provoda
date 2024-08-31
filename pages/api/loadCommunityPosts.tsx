import dbPost from "./conn"
import { Community, Account, postsParser } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { token, commun, limit = 10, offset = 0 } = req.body
        const community = new Community(commun)
        if (!await community.checkIfExists()){
            throw new Error("Community not found")
        }
        let user = new Account(token)
        if (await user.checkIfExists()){
            await user.fetchUnknowns()
        } else {
            user = null
        }
        let postsReq = await dbPost("SELECT * FROM posts WHERE commun = ? ORDER BY id DESC LIMIT ? OFFSET ?", [commun, limit, offset]);
        postsReq = await postsParser(postsReq, user)
        res.status(200).json(postsReq)
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}