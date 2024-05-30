import dbPost from "./conn"
import { Account } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { token, commun } = req.body
        const user = new Account(token)
        if (!await user.checkIfExists()){
            throw new Error("Acc not found")
        }
        const uniqueCommunResult = await dbPost("SELECT * FROM communities WHERE tag = ?", [commun]);
        if(uniqueCommunResult.length > 0) {
            throw new Error("Community tag already used");
        }
        await dbPost("INSERT INTO communities (tag) VALUES (?)", [commun])
        user.joinCommunity(commun, 'owner')
        res.status(200).json('succ')
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}