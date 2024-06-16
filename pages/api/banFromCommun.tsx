import dbPost from "./conn"
import { Account, Community } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { token, target, commun, reason } = req.body
        const mod = new Account(token)
        await mod.fetchUnknows()
        const targetUser = new Account(null, target)
        const community = new Community(commun)
        if (!await mod.checkIfExists()){
            throw new Error("Acc not found")
        }
        if (!await targetUser.checkIfExists()){
            throw new Error("Target not found")
        }
        await mod.fetchUnknows()
        await targetUser.fetchUnknows()
        const modrole = await mod.getRole(commun)
        const targetrole = await targetUser.getRole(commun)
        if (modrole != 'owner' && modrole != 'mod'){
            throw new Error("No permissions")
        }
        if (await community.checkIfBanned(target)){
            throw new Error("Target is already banned")
        }
        if (targetrole == 'owner' || targetrole == 'mod'){
            throw new Error("Target is community staff, target should be unmoded first")
        }
        if (target == mod.tag){
            throw new Error("Ban... yourself? Seriously? Not today")
        }
        await community.ban(target, reason)
        res.status(200).json('succ')
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}