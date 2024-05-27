import dbPost from "./conn"
const bcrypt = require("bcrypt")

export default async function handler(req: Request, res: Response){
    try {
        const { token, pass } = req.body

        const dbReq = await dbPost("SELECT pass FROM accounts WHERE token = ?", [token])
        if (dbReq.length == 0){
            throw new Error("Acc with that token is not found")
        }
        const isRightPass = await bcrypt.compare(pass, dbReq[0]['pass'])
        if (!isRightPass){
            throw new Error("Wrong password")
        }
        await dbPost("DELETE FROM accounts WHERE token = ?", [token])
        res.status(200).json("succ")
    } catch(err) {
        console.log(err.message)
        res.status(500).json([err.message])
    }
}