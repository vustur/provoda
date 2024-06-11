import dbPost from "./conn"
import { Account, Community } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { token, commun } = req.body
        const user = new Account(token)
        if (!await user.checkIfExists()){
            throw new Error("Acc not found")
        }
        await user.fetchUnknows()
        if (!user.checkIfJoined(commun)){
            throw new Error("Not joined")
        }
        const communtiy = new Community(commun)
        if (!await communtiy.checkIfExists()){
            throw new Error("Commun not found")
        }
        if (await user.getRole(commun) == 'owner'){
            throw new Error("Owner cant leave")
        }
        await user.leaveCommunity(commun)
        res.status(200).json('succ')
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}