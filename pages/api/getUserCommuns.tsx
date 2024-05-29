import dbPost from "./conn"
import { Account } from "./main"

export default async function handler(req: Request, res: Response){
    try {
        const { token } = req.body
        const user = new Account(token)
        if (!await user.checkIfExists()){
            throw new Error("Acc not found")
        }
        const communReq = await dbPost("SELECT commun FROM communMembers WHERE tag = ?", [tagReq[0]['tag']]);
        res.status(200).json(communReq.map(item => item['commun']))
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}