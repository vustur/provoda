import dbPost from "./conn"

export default async function handler(req: Request, res: Response) {
  try {
    const { tag } = req.body
    const postReq = await dbPost("SELECT SUM(reputation) as totalRep FROM posts WHERE authortag = ?", [tag]);
    let postRep = postReq ? postReq[0].totalRep : 0
    const commReq = await dbPost("SELECT SUM(reputation) as totalRep FROM comments WHERE authortag = ?", [tag]);
    let commRep = commReq ? commReq[0].totalRep : 0
    if (postRep == null) {
      postRep = 0
    }
    if (commRep == null) {
      commRep = 0
    }
    res.status(200).json({ postRep, commRep, "allRep": postRep + commRep })
  } catch (err) {
    console.log(err.message)
    res.status(500).json(err.message)
  }
}