import dbPost from "./conn"
import { Account, reserved } from "./main";

export default async function handler(req: Request, res: Response) {
    try {
        const { token, commun } = req.body
        const actualCommun = commun.toLowerCase();
        const allowedChars = /^[a-z0-9]+$/;
        const user = new Account(token)
        if (!await user.checkIfExists()) {
            throw new Error("Acc not found")
        }
        if (actualCommun.length > 19) {
            throw new Error("Tag too long")
        }
        if (actualCommun.length < 3) {
            throw new Error("Tag too short")
        }
        if (!actualCommun.match(allowedChars)) {
            throw new Error("Only a-z, 0-9 allowed in community tag")
        }
        if (reserved.includes(commun)) {
            throw new Error("Tag is not allowed")
        }
        const uniqueCommunResult = await dbPost("SELECT * FROM communities WHERE tag = ?", [actualCommun]);
        if (uniqueCommunResult.length > 0) {
            throw new Error("Community tag already used");
        }
        await dbPost("INSERT INTO communities (tag) VALUES (?)", [actualCommun])
        await user.fetchUnknowns()
        await user.joinCommunity(actualCommun, 'owner')
        res.status(200).json('succ')
    } catch (err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}