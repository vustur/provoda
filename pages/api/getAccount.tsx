import dbPost from "./conn"
import { Account } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { input } = req.body
        let user = input.length < 25 ? new Account(null, input) : new Account(input)
        if (!await user.checkIfExists()){
            throw new Error("Acc not found")
        }
        const addit = input.length >= 25 ? ", mail" : ""
        const dbReq = await user.getFromDB("id, nick, tag, bio, pfp" + addit);
        res.status(200).json([dbReq])
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}
