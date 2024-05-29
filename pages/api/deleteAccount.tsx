import dbPost from "./conn"
import { Account } from "./main"
const bcrypt = require("bcrypt")

export default async function handler(req: Request, res: Response){
    try {
        const { token, pass } = req.body

        const user = new Account(token)
        const dbHash = await user.getFromDB("pass")
        const isRightPass = await bcrypt.compare(pass, dbHash[0]['pass'])
        if (!isRightPass){
            throw new Error("Wrong password")
        }
        // user.delete()
        res.status(200).json("succ")
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}