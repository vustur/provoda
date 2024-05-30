import dbPost from "./conn"
import { Account, Community } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { token, target, commun, reason } = req.body
        const mod = new Account(token)
        await mod.fetchUnknows()
        const targetUser = new Account(null, target)
        const modrole = await mod.getRole()
        const targetrole = await targetUser.getRole()
        const community = new Community(commun)
        if (mod.checkIfExists() == false){
            throw new Error("Acc not found")
        }
        if (targetUser.checkIfExists() == false){
            throw new Error("Target not found")
        }
        if (modrole != 'owner' && modrole != 'mod'){
            throw new Error("No permissions")
        }
        if (targetrole == 'owner' || targetrole == 'mod'){
            throw new Error("Target is community staff, target should be unmoded first")
        }
        if (target == mod.tag){
            throw new Error("Ban... yourself? Seriously? Not today")
        }
        await targetUser.leaveCommunity(commun)
        await community.ban(target, reason)
        res.status(200).json('succ')
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}