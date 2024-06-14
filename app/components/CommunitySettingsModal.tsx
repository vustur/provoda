import React, { useState, useEffect, useContext } from "react"
import { mainContext } from "./PageBase"
import Image from "next/image"
import Button from "./IconButton"
import WluffyError from "./WluffyError"
import UserPreview from "./UserPreview"
import axios from "axios"

type Props = {
    commun: String
}

export default function CommunSettings({ commun }: Props) {
    const [isOpen, setIsOpen] = useState(false)
    const [errText, setErrText] = useState(null)
    const [communData, setCommunData] = useState(null)
    const [bans, setBans] = useState([])
    const [currentPassword, setCurrentPassword] = useState(null)
    const [choosenTab, setChoosenTab] = useState("Main")
    const [isBtnDisabled, setIsBtnDisabled] = useState(false)
    const [banInput, setBanInput] = useState("")
    const { ctxVal, setCtxVal } = useContext(mainContext)
    let token = localStorage.getItem("token")

    const openCSModal = () => {
        setIsOpen(true)
        fetchCommun()
        fetchBans()
    }

    const onLeftClick = (e) => {
        if (e.target.id == "backdrop") {
            setIsOpen(false)
        }
    }

    const fetchCommun = async () => {
        try {
            const req = await axios.post("/api/getCommun", { token, commun })
            const data = req.data
            console.log(data)
            setCommunData(data)
        }
        catch (err) {
            console.error(err.response.data)
        }
    }

    const fetchBans = async () => {
        try {
            const req = await axios.post("/api/getBansByCommun", { token, commun })
            const data = req.data
            console.log(data)
            setBans(data)
        }
        catch (err) {
            console.error(err.response.data)
        }
    }

    const ban = async () => {
        try {
            const req = await axios.post("/api/banFromCommun", { token, commun, target: banInput, reason: "No reason provided (DEF)" })
            const data = req.data
            console.log(data)
            setBanInput("")
            setErrText("")
        }
        catch (err) {
            console.error(err.response.data)
            setErrText(err.response.data)
        }
    }

    const unban = async (target) => {
        try {
            const req = await axios.post("/api/unbanFromCommun", { token, commun, target })
            const data = req.data
            console.log(data)
            setErrText("")
        }
        catch (err) {
            console.error(err.response.data)
            setErrText(err.response.data)
        }
    }

    const saveCommun = async () => {
        try {
            setIsBtnDisabled(true)
            const req = await axios.post("", { token, })
            const data = req.data
            console.log(data)
            setErrText(null)
            setIsOpen(false)
            ctxVal.refreshAccount()
            setIsBtnDisabled(false)
        }
        catch (err) {
            console.error(err.response.data)
            setErrText(err.response.data)
            setIsBtnDisabled(false)
        }
    }

    useEffect(() => {
        setCtxVal(prevVal => ({ ...prevVal, openCommunSettings: (commun) => openCSModal(commun) }))
    }, [])

    return (
        <div id="backdrop" className={`absolute w-screen h-screen top-[-12px] left-0 -mt-3 z-30 backdrop-blur-sm bg-black bg-opacity-10 flex flex-col items-center justify-center ${isOpen ? " " : "hidden"}`}
            onClick={(e) => onLeftClick(e)}>
            <div className="flex flex-col bg-[#414141] p-3 rounded-lg shadow-sm w-fit">
                <p className="text-2xl font-semibold text-[#f1f1f1] w-full text-center">Settings</p>
                <div className="w-full mb-3 inline-flex items-center justify-center gap-4">
                    <button className={`text-lg text-[#c1c1c1] font-semibold hover:text-purple-300 transition ease-in-out duration-100
                    ${choosenTab == "Main" ? "text-purple-300 underline font-bold" : ""}`}
                        onClick={() => setChoosenTab("Main")}>
                        Main
                    </button>
                    <button className={`text-lg text-[#c1c1c1] font-semibold hover:text-purple-300 transition ease-in-out duration-100
                    ${choosenTab == "Bans" ? "text-purple-300 underline font-bold" : ""}`}
                        onClick={() => setChoosenTab("Bans")}>
                        Bans
                    </button>
                </div>
                { /* Settings tabs */}
                {choosenTab == "Main" ? (
                    <div className="flex flex-col">
                        <div className="inline-flex items-center justify-center w-full">
                            <Image
                                src={"/images/placeholder.jpg"}
                                width={120}
                                height={120}
                                className="rounded-lg mr-4"
                                alt="placeholder"
                            />
                            <div>
                                <p className="text-lg font-semibold text-[#bdbdbd] my-2">
                                    # {communData?.main.tag}
                                </p>
                                <p className="text-lg font-semibold text-[#929292] my-2">
                                    Owner: @ {communData?.owner}
                                </p>
                            </div>
                        </div>
                    </div>
                ) : choosenTab == "Bans" ? (
                    <div className="flex flex-col w-[60vw] items-center">
                        <div className="w-full mb-4 flex flex-row gap-3">
                            <input
                                value={banInput}
                                onChange={(e) => setBanInput(e.target.value)}
                                placeholder="Input tag..."
                                className="mt-3 w-full h-10 rounded-md bg-[#393939] text-white text-lg p-2 font-semibold"
                            />
                            <Button
                                isSpecial={true}
                                isTextCentered={true}
                                text="Ban"
                                onClick={() => ban()}
                                className="mt-3 px-1"
                            />
                        </div>
                        {bans.length > 0 ? (
                            <div className="w-full flex flex-col">
                                {bans.map((ban) => (
                                    <UserPreview
                                        tag={ban.tag}
                                        bio={ban.reason}
                                        specButton="trash"
                                        specFunc={() => unban(ban.tag)}
                                        key={ban.tag}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="mt-10">
                                <WluffyError
                                    image="wluffy_with_box_light.png"
                                    textOne="No bans"
                                    textTwo="All banned users will be shown here"
                                    scale={280}
                                />
                            </div>
                        )
                        }
                    </div>
                ) : null}
                {errText && <p className="text-red-300 text-sm mt-2">{errText}</p>}
                <Button
                    onClick={choosenTab == "Main" ? () => { } : choosenTab == "Bans" ? () => { } : null}
                    text="Save"
                    isSpecial={true}
                    isTextCentered={true}
                    className={`${choosenTab == "Bans" ? "hidden" : null} mt-2 w-full`}
                    isDisabled={choosenTab == "Main" ? true : false}
                />
            </div>
        </div>
    )
}
