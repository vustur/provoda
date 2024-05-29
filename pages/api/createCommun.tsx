import dbPost from "./conn"

export default async function handler(req: Request, res: Response){
    try {
        const { token, commun } = req.body
        const tagReq = await dbPost("SELECT tag FROM accounts WHERE token = ?", [token]);
        if (tagReq[0].length == 0){
            throw new Error("Acc with that token is not found")
        }
        const uniqueCommunResult = await dbPost("SELECT * FROM communities WHERE tag = ?", [commun]);
        if(uniqueCommunResult.length > 0) {
            throw new Error("Community tag already used");
        }
        await dbPost("INSERT INTO communities (tag) VALUES (?)", [commun])
        await dbPost("INSERT INTO communMembers (tag, commun, role) VALUES (?, ?, 'owner')", [tagReq[0]['tag'], commun]);
        res.status(200).json('succ')
    } catch(err) {
        console.log(err.message)
        res.status(500).json([err.message])
    }
}