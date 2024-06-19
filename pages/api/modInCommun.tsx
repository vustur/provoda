import dbPost from "./conn"
import { Account, Community } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { token, target, commun } = req.body
        const mod = new Account(token)
        await mod.fetchUnknowns()
        const targetUser = new Account(null, target)
        const community = new Community(commun)
        if (!await mod.checkIfExists()){
            throw new Error("Acc not found")
        }
        if (!await targetUser.checkIfExists()){
            throw new Error("Target not found")
        }
        await mod.fetchUnknowns()
        await targetUser.fetchUnknowns()
        const modrole = await mod.getRole(commun)
        const targetrole = await targetUser.getRole(commun)
        if (modrole != 'owner'){
            throw new Error("No permissions")
        }
        if (await community.checkIfBanned(target)){
            throw new Error("Target is banned, should be unbanned first")
        }
        if (!await community.checkIfMember(target)){
            throw new Error("Target should be in the community before moding")
        }
        if (targetrole == 'owner' || targetrole == 'mod'){
            throw new Error("Target is community staff, cannot be moded")
        }
        if (target == mod.tag){
            throw new Error("Mod... yourself? From owner? Nah")
        }
        await community.mod(target)
        res.status(200).json('succ')
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}