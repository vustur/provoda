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
    async banFromCommunity(commun, reason){
        const isAlrdBanned = await dbPost("SELECT * FROM communBans WHERE tag = ? AND commun = ?", [target, commun])
        if (isAlrdBanned.length > 0){
            throw new Error("User is already banned")
        }
        await dbPost("INSERT INTO communBans (tag, commun, reason) VALUES (?, ?, ?)", [this.tag, commun, reason]);
    }
    async unbanFromCommunity(commun){
        const isAlrdBanned = await dbPost("SELECT * FROM communBans WHERE tag = ? AND commun = ?", [target, commun])
        if (isAlrdBanned.length == 0){
            throw new Error("User isnt banned")
        }
        await dbPost("DELETE FROM communBans WHERE tag = ? AND commun = ?", [this.tag, commun])
    }
    async checkIfBanned(commun){
        const isAlrdBanned = await dbPost("SELECT * FROM communBans WHERE tag = ? AND commun = ?", [target, commun])
        if (isAlrdBanned.length > 0){
            return true
        }
        return false
    }
    async getRole(commun){
        const targetRoleReq = await dbPost("SELECT role FROM communMembers WHERE tag = ? AND commun = ?", [target, commun]);
        return targetRoleReq[0]['role']
    }
}
