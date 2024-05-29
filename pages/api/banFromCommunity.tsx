import dbPost from "./conn"
import { Account } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { token, target, commun, reason } = req.body
        const mod = new Account(token)
        const target = new Account(null, target)
        const modrole = await mod.getRole()
        const targetrole = await target.getRole()
        if (mod.checkIfExists() == false){
            throw new Error("Acc not found")
        }
        if (target.checkIfExists() == false){
            throw new Error("Target not found")
        }
        if (modrole != 'owner' && modrole != 'mod'){
            throw new Error("No permissions")
        }
        if (targetrole == 'owner' || targetrole == 'mod'){
            throw new Error("Target is community staff, target should be unmoded first")
        }
        await target.leaveCommunity(commun)
        await target.banFromCommunity(commun, reason)
        res.status(200).json('succ')
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}