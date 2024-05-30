import dbPost from "./conn"

export class Account {
    constructor(token = null, tag = null){
        this.token = token
        this.tag = tag
    }
    async fetchUnknows(){
        if (this.token){
            let dbReq = await dbPost("SELECT tag FROM accounts WHERE token = ?", [this.token])
            this.tag = dbReq[0]['tag']
        } else {
            let dbReq = await dbPost("SELECT token FROM accounts WHERE tag = ?", [this.tag])
            this.tag = dbReq[0]['token']
        }
    }
    async register(mail, hashedPass){
        await dbPost("INSERT INTO accounts (tag, nick, token, mail, pass) VALUES (?, ?, ?, ?, ?)", [this.tag, this.tag, this.token, mail, hashedPass]);
    }
    async delete(){
        await dbPost("DELETE FROM accounts WHERE token = ?", [this.token])
    }
    async getFromDB(item){
        let dbReq
        if (this.token){
            dbReq = await dbPost("SELECT " + item + " FROM accounts WHERE token = ?", [this.token])
        } else {
            dbReq = await dbPost("SELECT " + item + " FROM accounts WHERE tag = ?", [this.tag])
        }
        if (dbReq.length == 0){
            throw new Error("Acc not found")
        }
        return dbReq[0]
    }
    async checkIfExists(){
        let dbReq
        if (this.token){
            dbReq = await dbPost("SELECT * FROM accounts WHERE token = ?", [this.token])
        } else {
            dbReq = await dbPost("SELECT * FROM accounts WHERE tag = ?", [this.tag])
        }
        if (dbReq.length == 0){
            return false
        }
        return true
    }
    async leaveCommunity(commun){
        await dbPost("DELETE FROM communMembers WHERE tag = ? AND commun = ?", [this.tag, commun]);
    }
    async joinCommunity(commun, role = 'member'){
        await dbPost("INSERT INTO communMembers (tag, commun, role) VALUES (?, ?, ?)", [this.tag, commun, role]);
    }
    async getRole(commun){
        const targetRoleReq = await dbPost("SELECT role FROM communMembers WHERE tag = ? AND commun = ?", [target, commun]);
        if (targetRoleReq.length == 0){
            return 'none'
        }
        return targetRoleReq[0]['role']
    }
}

export class Community {
    constructor(tag){
        this.tag = tag
    }
    async ban(target, reason){
        await dbPost("INSERT INTO communBans (tag, commun, reason) VALUES (?, ?, ?)", [target, this.tag, reason]);
    }
    async unban(target){
        await dbPost("DELETE FROM communBans WHERE tag = ? AND commun = ?", [target, this.tag])
    }
    async checkIfBanned(target){
        const banReq = await dbPost("SELECT * FROM communBans WHERE tag = ? AND commun = ?", [target, this.tag])
        if (banReq.length == 0){
            return false
        }
        return true
    }
    async checkIfExists(){
        const communReq = await dbPost("SELECT * FROM communities WHERE tag = ?", [this.tag])
        if (communReq.length == 0){
            return false
        }
        return true
    }
}

export class Post {
    constructor (authortag = null, commun = null, reputation = null, date = null, content = null, id = null){
        this.authortag = authortag
        this.commun = commun
        this.reputation = reputation
        this.date = date
        this.content = content
        this.id = id
    }
    async fetchUnknowns(){
        const dbReq = await dbPost("SELECT * FROM posts WHERE id = ?", [this.id])
        if (dbReq.length == 0){
            return []
        }
        this.authortag = dbReq[0]['authortag']
        this.reputation = dbReq[0]['reputation']
        this.date = dbReq[0]['date']
        this.content = dbReq[0]['content']
        this.parseContent2Array()
        return dbReq
    }
    async checkIfExists(){
        const dbReq = await dbPost("SELECT * FROM posts WHERE id = ?", [this.id])
        if (dbReq.length == 0){
            return false
        }
        return true
    }
    async parseContent2Array(){
        this.content = JSON.parse(this.content)
    }
    async parseContent2String(){
        this.content = JSON.stringify(this.content)
    }
    async create(){
        await dbPost("INSERT INTO posts (authortag, commun, content) VALUES (?, ?, ?)", [this.authortag, this.commun, this.content]);
    }
    async delete(){
        await dbPost("DELETE FROM posts WHERE id = ?", [this.id])
    }
    async changeReput(isPositive, calltag){
        const isAlrdRated = await dbPost("SELECT * FROM reputs WHERE id = ? AND usertag = ?", [this.id, calltag])
        if (isAlrdRated.length > 0){
            await this.deleteReput(calltag)
        }
        if (isPositive == "true"){ // there is no bool in json sadly
            await dbPost("UPDATE posts SET reputation = reputation + 1 WHERE id = ?", [this.id])
        } else {
            await dbPost("UPDATE posts SET reputation = reputation - 1 WHERE id = ?", [this.id])
        }
        await dbPost("INSERT INTO reputs (id, usertag, isPositive, type) VALUES (?, ?, ?, ?)", [this.id, calltag, isPositive, "post"])
    }
    async deleteReput(calltag){
        const dbReq = await dbPost("SELECT * FROM reputs WHERE id = ? AND usertag = ?", [this.id, calltag])
        if (dbReq.length == 0){
            throw new Error("User didnt rate this post")
        }
        if (dbReq[0]['isPositive'] == "true"){
            await dbPost("UPDATE posts SET reputation = reputation - 1 WHERE id = ?", [this.id])
        } else {
            await dbPost("UPDATE posts SET reputation = reputation + 1 WHERE id = ?", [this.id])
        }
        await dbPost("DELETE FROM reputs WHERE id = ? AND usertag = ?", [this.id, calltag])
    }
}

export default function handler(req: Request, res: Response) {
    const stArray = [
        "Bad bad bad bad bad bad...",
        "This is api, u should not be here",
        "Wrong place",
        "Return to main page, please",
        "Really, what u wanna to see here?",
        "Thats api, not much to say about it",
        "Api, Api, Api, Api, Api, Api, Api",
        "Roses are red, violets are blue, u shouldnt be here, so fck u",
        "Stop wasting your time, get a job already",
        "No access 403!!!! :3",
        "What did Wluffy said when he went to api? Nothing, he returned to main page as good person",
        "Type '../..' in url for cookie",
        "ОВИ ЗУБНОЕ ПАСТЕ ЩЯЩЬ-ЩЯЩЬ СВОБОДАРАВЕНСТВОУПЯЧКА... Oh, not that, sorry",
    ]

    return (
        res.status(200).json(stArray[Math.floor(Math.random() * stArray.length)])
    )
}