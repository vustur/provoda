import dbPost from "./conn"
import { Account } from "./main"

export default async function handler(req: Request, res: Response){
    try {
        const { token, commun } = req.body
        let data = {}
        const tagReq = await dbPost("SELECT tag, pfp FROM communities WHERE tag = ?", [commun]);
        if(tagReq.length == 0) {
            throw new Error("Unknown community");
        }
        data['main'] = tagReq[0]
        const memReq = await dbPost("SELECT role, tag FROM communMembers WHERE commun = ?", [commun]);
        data['mems'] = memReq.length
        let role = "none"
        if (token){
            const user = new Account(token)
            if (!await user.checkIfExists()){
                throw new Error("Acc not found")
            }
            await user.fetchUnknowns()
            role = await user.getRole(commun)
        }
        data['owner'] = memReq.filter(item => item.role === 'owner').map(item => item.tag)[0]
        if (data['owner'] == undefined){
            data['owner'] = 'unknown'
        }
        data['role'] = role
        res.status(200).json(data)
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}
