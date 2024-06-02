'use client'
import axios from "axios"
import { useState } from "react"
const Cookie = require('js-cookie')

export default function Home() {
    const [isLogin, setIsLogin] = useState(true)
    const [errText, setErrText] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [mail, setMail] = useState("")

    const login = async () => {
        try {
            const req = await axios.post("/api/login", { tag: username, pass: password })
            Cookie.set("token", req.data.token)
            window.location.href = "/"
        }
        catch (err) {
            console.log(err.response.data)
            setErrText(err.response.data)
        }
    }

    const register = async () => {
        try {
            const req = await axios.post("/api/createAccount", { tag: username, pass: password, mail: mail })
            Cookie.set("token", req.data.token)
            window.location.href = "/"
        }
        catch (err) {
            console.log(err.response.data)
            setErrText(err.response.data)
        }
    }

    return(
        <div className="h-screen w-screen flex-col inline-flex items-center justify-center bg-[#363636]">
            <div className="bg-[#2d2d2d] p-4 rounded-lg flex flex-col">
                <h1 className="text-[#ececec] text-3xl font-bold text-center">{isLogin ? "Login" : "Register"}</h1>
                <input
                type="text"
                placeholder="Username"
                className="mt-3 w-full h-10 rounded-md bg-[#393939] text-white text-sm p-2 font-semibold"
                onChange={(e) => setUsername(e.target.value)}
                />
                <input
                type="password"
                placeholder="Password"
                className="mt-3 w-full h-10 rounded-md bg-[#393939] text-white text-sm p-2 font-semibold"
                onChange={(e) => setPassword(e.target.value)}
                />
                { isLogin ? null :
                <input
                type="text"
                placeholder="Mail"
                className="mt-3 w-full h-10 rounded-md bg-[#393939] text-white text-sm p-2 font-semibold"
                onChange={(e) => setMail(e.target.value)}
                />
                }
                {errText ? <p className="text-red-300 text-sm mt-2">{errText}</p> : null}
                <button
                className="mt-3 w-full h-10 rounded-md bg-[#816b9d] hover:bg-[#77658e] text-white text-sm p-2 font-semibold transition ease-in-out duration-300"
                onClick={isLogin ? login : register}
                >{isLogin ? "Login" : "Register"}</button>
                <button
                className="w-full h-5 rounded-md text-white text-sm p-2"
                onClick={() => setIsLogin(!isLogin)}
                >{isLogin ? "No account?" : "Already registered?"}</button>
            </div>
        </div>
    )
}