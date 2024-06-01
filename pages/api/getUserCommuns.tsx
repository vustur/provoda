import dbPost from "./conn"
import { Account } from "./main"

export default async function handler(req: Request, res: Response){
    try {
        const { token } = req.body
        const user = new Account(token)
        if (!await user.checkIfExists()){
            throw new Error("Acc not found")
        }
        await user.fetchUnknows()
        const communReq = await dbPost("SELECT commun FROM communMembers WHERE tag = ?", [user.tag]);
        if (communReq.length == 0){
            throw new Error("No communities")
        }
        res.status(200).json(communReq.map(item => item['commun']))
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}