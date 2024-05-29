import dbPost from "./conn"

export default async function handler(req: Request, res: Response){
    try {
        const { token, target, commun } = req.body
        const tagReq = await dbPost("SELECT tag FROM accounts WHERE token = ?", [token]);
        if (tagReq[0].length == 0){
            throw new Error("Acc with that token is not found")
        }
        const roleReq = await dbPost("SELECT role FROM communMembers WHERE tag = ? AND commun = ?", [tagReq[0]['tag'], commun]);
        if(roleReq[0]['role'] != 'owner' && roleReq[0]['role'] != 'mod') {
            throw new Error("No permissions");
        }
        const isAlrdBanned = await dbPost("SELECT * FROM communBans WHERE tag = ? AND commun = ?", [target, commun])
        if (isAlrdBanned.length == 0){
            throw new Error("User isnt banned")
        }
        await dbPost("DELETE FROM communBans WHERE tag = ? AND commun = ?", [target, commun])
        res.status(200).json('succ')
    } catch(err) {
        console.log(err.message)
        res.status(500).json([err.message])
    }
}