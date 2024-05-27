import dbPost from "./conn"

export default async function handler(req: Request, res: Response){
    try {
        const { tag } = req.body
        const dbReq = await dbPost("SELECT id, nick, tag, bio, pfp FROM accounts WHERE tag = ?", [tag]);
        if(dbReq.length == 0) {
            throw new Error("Unknown user");
        }
        res.status(200).json(dbReq[0])
    } catch(err) {
        console.log(err.message)
        res.status(500).json([err.message])
    }
}
