import dbPost from "./conn"
import { Account } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { token, commun } = req.body
        const user = new Account(token)
        if (!await user.checkIfExists()){
            throw new Error("Acc not found")
        }
        await user.fetchUnknowns()
        if (await user.checkIfJoined(commun)){
            throw new Error("Already joined")
        }
        await user.joinCommunity(commun)
        res.status(200).json('succ')
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}