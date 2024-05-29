import dbPost from "./conn"

export default async function handler(req: Request, res: Response){
    try {
        const { token, target, commun, reason } = req.body
        const tagReq = await dbPost("SELECT tag FROM accounts WHERE token = ?", [token]);
        if (tagReq[0].length == 0){
            throw new Error("Acc with that token is not found")
        }
        const roleReq = await dbPost("SELECT role FROM communMembers WHERE tag = ? AND commun = ?", [tagReq[0]['tag'], commun]);
        if(roleReq[0]['role'] != 'owner' && roleReq[0]['role'] != 'mod') {
            throw new Error("No permissions");
        }
        const targetRoleReq = await dbPost("SELECT role FROM communMembers WHERE tag = ? AND commun = ?", [target, commun]);
        if (targetRoleReq.length > 0){
            if(targetRoleReq[0]['role'] == 'owner' || targetRoleReq[0]['role'] == 'mod') {
                throw new Error("Target is community staff, target should be unmoded first");
            }
        }
        await dbPost("DELETE FROM communMembers WHERE tag = ? AND commun = ?", [target, commun])
        const isAlrdBanned = await dbPost("SELECT * FROM communBans WHERE tag = ? AND commun = ?", [target, commun])
        if (isAlrdBanned.length > 0){
            throw new Error("User is already banned")
        }
        await dbPost("INSERT INTO communBans (tag, commun, reason) VALUES (?, ?, ?)", [target, commun, reason])
        res.status(200).json('succ')
    } catch(err) {
        console.log(err.message)
        res.status(500).json([err.message])
    }
}