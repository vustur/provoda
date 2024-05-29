import dbPost from "./conn"

export default async function handler(req: Request, res: Response){
    try {
        const { token, target, commun, reason } = req.body
        const mod = new Account(token)
        const target = new Account(null, target)
        const modrole = await mod.getRole()
        if (mod.checkIfExists() == false){
            throw new Error("Acc not found")
        }
        if (target.checkIfExists() == false){
            throw new Error("Target not found")
        }
        if (modrole != 'owner' && modrole != 'mod'){
            throw new Error("No permissions")
        }
        await target.unbanFromCommunity(commun)
        res.status(200).json('succ')
    } catch(err) {
        console.log(err.message)
        res.status(500).json([err.message])
    }
}