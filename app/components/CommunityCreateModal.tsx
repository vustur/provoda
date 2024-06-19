import React, { useState, useEffect, useContext } from "react"
import { mainContext } from "./PageBase"
import Button from "./IconButton"
import axios from "axios"

export default function WriteModal() {
    const [tag, setTag] = useState()
    const [isOpen, setIsOpen] = useState(false)
    const [errText, setErrText] = useState(null)
    const { ctxVal, setCtxVal } = useContext(mainContext)
    let token = typeof window !== "undefined" ? window.localStorage.getItem('token') : null

    const openCCModal = () => {
        setIsOpen(true)
    }

    const onLeftClick = (e) => {
        if (e.target.id == "backdrop") {
            setIsOpen(false)
        }
    }

    const createCommun = async () => {
        try {
            const fetch = await axios.post("/api/createCommun", { token, commun: tag })
            const data = fetch.data
            console.log(data)
            setErrText(null)
            setIsOpen(false)
            ctxVal.refreshCommuns()
        } catch (err) {
            console.error(err.response.data)
            setErrText(err.response.data)
        }
    }

    useEffect(() => {
        setCtxVal(prevVal => ({ ...prevVal, openCommunCreate: () => openCCModal() }))
    }, [])

    return (
        <div id="backdrop" className={`absolute w-screen h-screen top-0 left-0 z-30 backdrop-blur-sm bg-black bg-opacity-10 flex flex-col items-center justify-center ${isOpen ? " " : "hidden"}`}
            onClick={(e) => onLeftClick(e)}>
            <div className="flex flex-col bg-[#414141] p-2 rounded-lg shadow-sm w-[30%]">
                <p className="mb-2 text-white font-semibold text-2xl text-center">Create new community</p>
                <input
                    type="text"
                    placeholder="Tag"
                    className="mt-3 w-full h-10 rounded-md bg-[#393939] text-white text-lg p-2 font-semibold"
                    onChange={(e) => setTag(e.target.value)}
                />
                {errText ? <p className="text-red-300 text-sm mt-2">{errText}</p> : null}
                <Button
                    onClick={createCommun}
                    text="Create"
                    isSpecial={true}
                    className="mt-2 w-full text-center"
                    isTextCentered={true}>
                </Button>
            </div>
        </div>
    )
}
