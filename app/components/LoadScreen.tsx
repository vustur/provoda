import { useState, useEffect } from "react"
import axios from "axios"
const Cookie = require("js-cookie")

let progress = []
let setIsReadyFunc = null

export default function LoadScreen({ setIsReady }) {
    setIsReadyFunc = setIsReady // There is confusing code, sorry :D
    const [isRlReady, setIsRlReady] = useState(false)
    let token = Cookie.get("token")

    useEffect(() => {
        const interval = setInterval(() => {
            if (progress.length == 4) {
                setIsRlReady(true)
                clearInterval(interval)
                console.log("Reeeady!")
            }
        }, 100)
    }, [])

    const checkIfExists = async () => {
        let token = Cookie.get("token")
        try{
            const req = await axios.post("/api/getAccount", {"input" : token})
            const data = req.data
            console.log(data)
        }
        catch(err){
            console.error(err.response.data)
            if (err.response.data == "Acc not found"){
                console.log("Looks like token is invalid, going to login page")
                Cookie.set("token", null)
                window.location = "/login"
            }
        }
    }

    useEffect(() => {
        checkIfExists()
    })

    return (
        <div className={`absolute bg-[#343434] w-full h-full flex flex-col items-center justify-center z-50 transition duration-300 ease-in-out
            ${!isRlReady ? "opacity-100" : "opacity-0 hidden"}`}>
            <p className="text-xl font-semibold text-[#cecece]">Loading...</p>
            <p className="text-base font-semibold text-[#cecece]">If load tooks too long, reload page</p>
        </div>
    )
}

export const addProgress = (name) => {
    if (progress.includes(name)){
        return
    }
    progress.push(name)
    // console.log("Prg " + progress.length.toString())
    if (setIsReadyFunc && progress.length === progress.length) {
        setIsReadyFunc(true)
    }
}

