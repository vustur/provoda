import dbPost from "./conn"

export default async function handler(req: Request, res: Response){
    try {
        const { commun } = req.body
        let data = {}
        const tagReq = await dbPost("SELECT tag FROM communities WHERE tag = ?", [commun]);
        if(tagReq.length == 0) {
            throw new Error("Unknown community");
        }
        data['main'] = tagReq[0]
        const memReq = await dbPost("SELECT role, tag FROM communMembers WHERE commun = ?", [commun]);
        data['mems'] = memReq.length
        data['owner'] = memReq.filter(item => item.role === 'owner').map(item => item.tag)[0]
        if (data['owner'] == undefined){
            data['owner'] = 'unknown'
        }
        res.status(200).json(data)
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}
