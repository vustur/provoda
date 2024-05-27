import dbPost from "./conn"
const bcrypt = require("bcrypt")

export default async function handler(req: Request, res: Response){
    try {
        const { tag, mail, pass } = req.body
        const tagAllowedChars = /^[a-z0-9_]*$/;
        if (tag.length > 15) {
            throw new Error("Tag too long");
        } else if (tag.length < 3) {
            throw new Error("Tag too short");
        } else if (!tag.match(tagAllowedChars)) {
            throw new Error("Only a-z, 0-9 and _ allowed in username");
        } else if (pass.length < 8) {
            throw new Error("Password too short (8 chars minimum)");
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
        let token = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789*_-=+[],.~:;';
        for (let i = 0; i < 50; i++) {
          token += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        token += "/" + Buffer.from(tag).toString('base64')
        await dbPost("INSERT INTO accounts (tag, nick, token, mail, pass) VALUES (?, ?, ?, ?, ?)", [tag, tag, token, mail, hashedPass]);
        res.status(200).json("succ")
    } catch(err) {
        console.log(err.message)
        res.status(500).json([err.message])
    }
}
