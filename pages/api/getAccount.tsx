import dbPost from "./conn"
import { Account } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { tag } = req.body
        const user = new Account(null, tag)
        if (!await user.checkIfExists()){
            throw new Error("Acc not found")
        }
        const dbReq = await user.getFromDB("id, nick, tag, bio, pfp")
        res.status(200).json([dbReq])
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}
