import dbPost from "./conn"

export default async function handler(req: Request, res: Response){
    try {
        const { token, pass = null, newPass = null, newNick = null, newBio = null } = req.body
        
        const dbReq = await dbPost("SELECT pass, nick, mail FROM accounts WHERE token = ?", [token])
        if (dbReq.length == 0){
            throw new Error("Acc with that token is not found")
        }
        if (newPass){
            const dbReq = await dbPost("SELECT pass FROM accounts WHERE token = ?", [token])
            if (!pass){
                throw new Error("To change password you should input old password")
            }
            const isRightPass = await bcrypt.compare(pass, dbReq[0]['pass'])
            if (!isRightPass){
                throw new Error("Wrong password")
            }
            await dbPost("UPDATE accounts SET pass WHERE token = ?", [newPass, token]);
        }
        if (newNick){
            if (tag.length > 15) {
                throw new Error("Tag too long");
            } else if (tag.length < 3) {
                throw new Error("Tag too short");
            }
            await dbPost("UPDATE accounts SET nick = ? WHERE token = ?", [newNick, token]);
        }
        if (newBio){
            if (newBio.length > 120) {
                throw new Error("Bio too long");
            }
            await dbPost("UPDATE accounts SET bio = ? WHERE token = ?", [newBio, token]);
        }
        res.status(200).json("succ")
    } catch(err) {
        console.log(err.message)
        res.status(500).json([err.message])
    }
}