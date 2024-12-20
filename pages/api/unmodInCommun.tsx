import dbPost from "./conn"
import { Account, Community } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { token, target, commun } = req.body
        const mod = new Account(token)
        const targetUser = new Account(null, target)
        const community = new Community(commun)
        if (mod.checkIfExists() == false){
            throw new Error("Acc not found")
        }
        if (targetUser.checkIfExists() == false){
            throw new Error("Target not found")
        }
        await mod.fetchUnknowns()
        const modrole = await mod.getRole(commun)
        console.log(commun)
        console.log(modrole)
        if (modrole != 'owner'){
            throw new Error("No permissions")
        }
        if (!community.checkIfBanned(target)){
            throw new Error("Target isnt mod")
        }
        await community.unmod(target)
        res.status(200).json('succ')
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}