'use client'
import axios from "axios"
import { useState } from "react"
import Cookies from "js-cookie"

export default function Home() {
    const [isLogin, setIsLogin] = useState(true)
    const [errText, setErrText] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [mail, setMail] = useState("")

    const login = async () => {
        try {
            const req = await axios.post("/api/login", { tag: username, pass: password })
            succLogin(req.data.token)
        }
        catch (err) {
            console.log(err.response.data)
            setErrText(err.response.data)
        }
    }

    const register = async () => {
        try {
            const req = await axios.post("/api/createAccount", { tag: username, pass: password, mail: mail })
            succLogin(req.data.token)
        }
        catch (err) {
            console.log(err.response.data)
            setErrText(err.response.data)
        }
    }

    const succLogin = async (token) => {
        Cookies.set('token', token)
        setErrText(null)
        await new Promise(res => setTimeout(res, 1000))
        window.location.href = "/"
    }

    return (
        <div className="h-screen w-screen flex-col inline-flex items-center justify-center bg-[#363636]">
            <p className="w-fit cursor-help font-semibold text-4xl bg-clip-text text-transparent bg-gradient-to-r from-[#e0e0e0] to-[#9354B1]"
                onClick={() => window.location = "/about"}
            >Provoda</p>
            <p className="text-[#575656] text-sm mb-3 font-semibold text-center">Click to learn more !</p>
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
                {isLogin ? null :
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