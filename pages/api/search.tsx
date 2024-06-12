import dbPost from "./conn"

export default async function handler(req: Request, res: Response) {
    try {
        const { text } = req.body
        const lText = "%" + text + "%"

        const accnReq = await dbPost("SELECT * FROM accounts WHERE nick LIKE ? OR tag LIKE ? LIMIT 5", [lText, lText]);
        const commReq = await dbPost("SELECT * FROM communities WHERE tag LIKE ? LIMIT 5", [lText]);
        let   postReq = await dbPost("SELECT * FROM posts WHERE content LIKE ? ORDER BY reputation DESC LIMIT 5", [lText]);
        for (let i = 0; i < postReq.length; i++){
            let post = postReq[i]
            let base64 = Buffer.from(post["content"]).toString('base64')
            postReq[i]["content"] = Buffer.from(base64, 'base64').toString('utf-8')
        }
        const result = {acc : accnReq, comm : commReq, post : postReq}
        res.status(200).json(result)
    } catch (err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}
