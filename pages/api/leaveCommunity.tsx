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
        const roleReq = await dbPost("SELECT role FROM communMembers WHERE tag = ? AND commun = ?", [tagReq[0]['tag'], commun]);
        if (roleReq.length > 0) {
            if (roleReq[0]['role'] == "owner"){
                throw new Error("Owner cant leave communities he owns (community transfer will be added later)")
            }
        } else {
            throw new Error("You arent member of this community");
        }
        await dbPost("DELETE FROM communMembers WHERE tag = ? AND commun = ?", [tagReq[0]['tag'], commun])
        res.status(200).json('succ')
    } catch(err) {
        console.log(err.message)
        res.status(500).json([err.message])
    }
}