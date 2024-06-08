import dbPost from "./conn"
import { Account, Community } from "./main";

export default async function handler(req: Request, res: Response) {
    try {
        let role
        const { token, commun } = req.body
        const user = new Account(token)
        if (!await user.checkIfExists()) {
            throw new Error("Acc not found")
        }
        await user.fetchUnknows()
        const community = new Community(commun)
        if (!await community.checkIfExists()) {
            throw new Error("Community not found")
        }
        role = await user.getRole(commun)
        res.status(200).json(role)
    } catch (err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}
