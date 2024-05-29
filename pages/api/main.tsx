import dbPost from "./conn"

export class Account {
    constructor(token = null, tag = null){
        this.token = token
        this.tag = tag
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
            dbReq = await dbPost("SELECT * FROM accounts WHERE token = ?", [this.tag])
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
    async joinCommunity(commun){
        await dbPost("INSERT INTO communMembers (tag, commun) VALUES (?, ?)", [this.tag, commun]);
    }
    async getRole(commun){
        const targetRoleReq = await dbPost("SELECT role FROM communMembers WHERE tag = ? AND commun = ?", [target, commun]);
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
}
