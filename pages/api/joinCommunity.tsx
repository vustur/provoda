import dbPost from "./conn"

export default async function handler(req: Request, res: Response){
    try {
        const { token, commun } = req.body
        const tagReq = await dbPost("SELECT tag FROM accounts WHERE token = ?", [token]);
        if (tagReq[0].length == 0){
            throw new Error("Acc with that token is not found")
        }
        const isCommunExists = await dbPost("SELECT * FROM communities WHERE tag = ?", [commun])
        if (isCommunExists.length == 0){
            throw new Error("Community doesnt exist")
        }
        const isAlrdJoinedReq = await dbPost("SELECT * FROM communMembers WHERE tag = ? AND commun = ?", [tagReq[0]['tag'], commun]);
        if(isAlrdJoinedReq.length > 0) {
            throw new Error("Already joined");
        }
        const isBanned = await dbPost("SELECT * FROM communBans WHERE tag = ? AND commun = ?", [tagReq[0]['tag'], commun])
        if (isBanned.length > 0){
            throw new Error("User is banned")
        }
        await dbPost("INSERT INTO communMembers (tag, commun) VALUES (?, ?)", [tagReq[0]['tag'], commun])
        res.status(200).json('succ')
    } catch(err) {
        console.log(err.message)
        res.status(500).json([err.message])
    }
}