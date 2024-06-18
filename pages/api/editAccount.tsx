import dbPost from "./conn"
import { Account, imgUploader } from "./main"
import bcrypt from "bcrypt"

export default async function handler(req: Request, res: Response){
    try {
        const { token, pass = null, newPass = null, newNick = null, newBio = null, newMail = null, newAvatar = null } = req.body
        const user = new Account(token)
        if (!await user.checkIfExists()){
            throw new Error("Acc not found")
        }
        let rightPassProvided = false
        if (pass && (newPass || newMail)){
            const dbReq = await dbPost("SELECT pass FROM accounts WHERE token = ?", [token])
            console.log(dbReq[0]['pass'])
            console.log(pass)
            const isRightPass = await bcrypt.compare(pass, dbReq[0]['pass'])
            if (!isRightPass){
                throw new Error("Wrong password")
            }
            rightPassProvided = true
        }
        if (newPass){
            if (!pass){
                throw new Error("To change password you should input old password")
            }
            if (!rightPassProvided){
                throw new Error("Wrong password")
            }
            if (newPass.length < 8) {
                throw new Error("Password too short (8 chars minimum)");
            }
            await dbPost("UPDATE accounts SET pass WHERE token = ?", [newPass, token]);
        }
        if (newNick){
            if (newNick.length > 15) {
                throw new Error("Nick too long");
            } else if (newNick.length < 3) {
                throw new Error("Nick too short");
            }
            await dbPost("UPDATE accounts SET nick = ? WHERE token = ?", [newNick, token]);
        }
        if (newBio){
            if (newBio.length > 120) {
                throw new Error("Bio too long");
            }
            await dbPost("UPDATE accounts SET bio = ? WHERE token = ?", [newBio, token]);
        }
        if (newMail){
            if (!pass){
                throw new Error("To change password you should input old password")
            }
            if (!rightPassProvided){
                throw new Error("Wrong password")
            }
            await dbPost("UPDATE accounts SET mail = ? WHERE token = ?", [newMail, token]);
        }
        if (newAvatar){
            const imgUploadedUrl = await imgUploader(newAvatar)
            await dbPost("UPDATE accounts SET pfp = ? WHERE token = ?", [imgUploadedUrl, token]);
        }
        res.status(200).json("succ")
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}