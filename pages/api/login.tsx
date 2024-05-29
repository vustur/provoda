import dbPost from "./conn"
const bcrypt = require("bcrypt")

export default async function handler(req: Request, res: Response){
    try {
        // const body = JSON.parse(req.body)
        const { tag, pass } = req.body

        const dbReq = await dbPost("SELECT token, pass FROM accounts WHERE tag = ?", tag);
        const [passHash, token] = dbReq ? [dbReq[0]['pass'], dbReq[0]['token']] : [null, null];
        if (token == null){
            throw new Error("Acc not found")
        }
        const isRightPass = await bcrypt.compare(pass, passHash)
        if (!isRightPass){
            throw new Error("Wrong password")
        }
        res.status(200).json(["succ"])
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}
