// import dbPost from "./conn"

export default async function handler(req: Request, res: Response){
    try {
        // dbPost req
        res.status(200).json(req.body)
    } catch(err) {
        res.status(500).json([err.message])
    }
}
