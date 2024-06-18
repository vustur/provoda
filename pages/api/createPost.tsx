import dbPost from "./conn"
import axios from "axios"
const imgbbUploader = require("imgbb-uploader")
import { Post, Account, Community } from "./main";

export default async function handler(req: Request, res: Response) {
    try {
        const { token, commun, content } = req.body
        let nContent = content
        const user = new Account(token)
        const community = new Community(commun)
        if (!await user.checkIfExists()) {
            throw new Error("Acc not found")
        }
        await user.fetchUnknows()
        if (!await community.checkIfExists()) {
            throw new Error("Community not found")
        }
        if (await community.checkIfBanned(user.tag)) {
            throw new Error("Acc is banned from this community")
        }
        if (content.title == null || content.text == null) {
            throw new Error("Wrong content")
        }
        if (content.title.length > 100 || content.text.length > 4000) {
            throw new Error("Content too long (max 100 chars for title and 4000 chars for content)")
        }
        if (content.title.length < 3 || content.text.length < 10) {
            throw new Error("Content too short (min 3 chars for title and 10 chars for content)")
        }
        if (content.attach) {
            // todo: server side check
            let key = process.env.IMGHOST_KEY
            console.log(key)
            await imgbbUploader({apiKey: key, base64string: content.attach})
                .then((response) => {
                    console.log(response)
                    nContent.attach = response.url
                })
                .catch((error) => console.error(error));
            if (nContent.attach.length > 100) {
                console.log("Looks like attach failed, so setting content attach to null")
                nContent.attach = null
            }
        }
        console.log(nContent)
        const post = new Post(user.tag, commun, null, null, nContent)
        await post.parseContent2String()
        await post.create()
        res.status(200).json('succ')
    } catch (err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}