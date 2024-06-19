import dbPost from "./conn"
import { Account, Community, imgUploader } from "./main"

export default async function handler(req: Request, res: Response){
    try {
        const { token, commun, newAvatar = null } = req.body
        const user = new Account(token)
        const community = new Community(commun)
        if (!await user.checkIfExists()){
            throw new Error("Acc not found")
        }
        await user.fetchUnknowns()
        if (!await community.checkIfExists()){
            throw new Error("Community not found")
        }
        if (!await user.getRole(user.tag) == "owner"){
            throw new Error("No permissions")
        }
        if (newAvatar){
            const imgUploadedUrl = await imgUploader(newAvatar)
            await dbPost("UPDATE communities SET pfp = ? WHERE tag = ?", [imgUploadedUrl, commun]);
        }
        res.status(200).json("succ")
    } catch(err) {
        console.log(err.message)
        res.status(500).json(err.message)
    }
}