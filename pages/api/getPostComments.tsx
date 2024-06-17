import dbPost from "./conn"
import { Account, Post } from "./main";

export default async function handler(req: Request, res: Response){
    try {
        const { postid } = req.body
        const post = new Post(null, null, null, null, null, postid)
        if (!await post.checkIfExists()){
            throw new Error("Post not found")
        }
        let comReq = await dbPost("SELECT * FROM comments WHERE postId = ? AND replyto  = 0 ORDER BY reputation DESC", [postid]);
        let rplReq = await dbPost("SELECT * FROM comments WHERE postId = ? AND replyto != 0 ORDER BY id ASC", [postid]);
        if (comReq.length == 0){
            throw new Error("No comments")
        }
        for (let i = 0; i < comReq.length; i++){ // for comments
            let comm = comReq[i]
            let base64 = Buffer.from(comm["content"]).toString('base64')
            comReq[i]["content"] = Buffer.from(base64, 'base64').toString('utf-8')
        }
        for (let i = 0; i < rplReq.length; i++){ // for replies
            let comm = rplReq[i]
            let base64 = Buffer.from(comm["content"]).toString('base64')
            rplReq[i]["content"] = Buffer.from(base64, 'base64').toString('utf-8')
        }
        comReq.forEach(comment => {
            comment.replies = []
        });
        rplReq.forEach(reply => {
            const comment = comReq.find(comment => comment.id === reply.replyto)
            if (comment) {
                comment.replies.push(reply)
            }
        });
        res.status(200).json(comReq)
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}