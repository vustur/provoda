import dbPost from "./conn"

export default async function handler(req: Request, res: Response){
    try {
        const { token } = req.body
        const tagReq = await dbPost("SELECT tag FROM accounts WHERE token = ?", [token]);
        if (tagReq[0].length == 0){
            throw new Error("Acc with that token is not found")
        }
        const communReq = await dbPost("SELECT commun FROM communMembers WHERE tag = ?", [tagReq[0]['tag']]);
        res.status(200).json(communReq.map(item => item['commun']))
    } catch(err) {
        console.log(err.message)
        res.status(500).json([err.message])
    }
}