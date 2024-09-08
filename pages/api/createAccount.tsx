import dbPost from "./conn"
import { Account, reserved, genToken } from "./main"
const bcrypt = require("bcrypt")

export default async function handler(req: Request, res: Response){
    try {
        const { tag, mail, pass } = req.body
        console.log(req.body)
        const tagAllowedChars = /^[a-z0-9_]*$/;
        if (tag.length > 19) {
            throw new Error("Tag too long");
        } else if (tag.length < 3) {
            throw new Error("Tag too short");
        } else if (!tag.match(tagAllowedChars)) {
            throw new Error("Only a-z, 0-9 and _ allowed in username");
        } else if (pass.length < 8) {
            throw new Error("Password too short (8 chars minimum)");
        } else if (reserved.includes(tag)) {
            throw new Error("Tag is not allowed")
        }
        const uniqueMailResult = await dbPost("SELECT * FROM accounts WHERE mail = ?", [mail]);
        if(uniqueMailResult.length > 0) {
            throw new Error("Mail already used");
        }
        const uniqueTagResult = await dbPost("SELECT * FROM accounts WHERE tag = ?", [tag]);
        if(uniqueTagResult.length > 0) {
            throw new Error("Tag already used");
        }

        const hashedPass = await bcrypt.hash(pass, 10)
        const token = await genToken(new Date().toString())
        await new Account(token, tag).register(mail, hashedPass)
        res.status(200).json({token : token})
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}
