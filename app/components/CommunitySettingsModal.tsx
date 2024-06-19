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
    const [mods, setMods] = useState([])
    const [currentPassword, setCurrentPassword] = useState(null)
    const [choosenTab, setChoosenTab] = useState("Main")
    const [isBtnDisabled, setIsBtnDisabled] = useState(false)
    const [banInput, setBanInput] = useState("")
    const [modInput, setModInput] = useState("")
    const [attach, setAttach] = useState(null)
    const [banReason, setBanReason] = useState("")
    const [selfRole, setSelfRole] = useState("none")
    const { ctxVal, setCtxVal } = useContext(mainContext)
    let token = typeof window !== "undefined" ? window.localStorage.getItem('token') : null

    const openCSModal = (commun, role) => {
        setIsOpen(true)
        fetchCommun()
        setSelfRole(role)
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
            const sendBR = banReason == "" ? "Reason not provided" : banReason
            const req = await axios.post("/api/banFromCommun", { token, commun, target: banInput, reason: sendBR })
            const data = req.data
            console.log(data)
            setBanInput("")
            setErrText("")
            fetchBans()
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
            fetchBans()
        }
        catch (err) {
            console.error(err.response.data)
            setErrText(err.response.data)
        }
    }

    const fetchMods = async () => {
        try {
            const req = await axios.post("/api/getModsByCommun", { token, commun })
            const data = req.data
            console.log(data)
            setMods(data)
        }
        catch (err) {
            console.error(err.response.data)
        }
    }

    const mod = async () => {
        try {
            const req = await axios.post("/api/modInCommun", { token, commun, target: modInput })
            const data = req.data
            console.log(data)
            setModInput("")
            setErrText("")
            fetchMods()
        }
        catch (err) {
            console.error(err.response.data)
            setErrText(err.response.data)
        }
    }

    const unmod = async (target) => {
        try {
            const req = await axios.post("/api/unmodInCommun", { token, commun, target })
            const data = req.data
            console.log(data)
            setErrText("")
            fetchMods()
        }
        catch (err) {
            console.error(err.response.data)
            setErrText(err.response.data)
        }
    }

    const saveCommun = async () => {
        try {
            setIsBtnDisabled(true)
            const sendAvatar = attach ? attach : null
            const req = await axios.post("/api/editCommun", { token, commun, newAvatar: sendAvatar })
            const data = req.data
            console.log(data)
            setErrText(null)
            setIsOpen(false)
            // refresh
            setIsBtnDisabled(false)
        }
        catch (err) {
            console.error(err.response.data)
            setErrText(err.response.data)
            setIsBtnDisabled(false)
        }
    }

    const onAttach = (e) => {
        const file = e.target.files[0]
        if (!file) return
        const fileSizeLimit = 10 * 1024 * 1024
        const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif']
        if (file.size > fileSizeLimit) {
            setErrText('Max allowed file size is ' + fileSizeLimit / 1024 / 1024 + 'MB')
            return
        }
        const { name: fileName } = file;
        const fileExtension = fileName.slice((fileName.lastIndexOf('.') - 1 >>> 0) + 2)
        if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
            setErrText('Only images or gifs are allowed (' + allowedExtensions.join(', ') + ')')
            return
        }

        const reader = new FileReader()
        reader.onload = () => {
            const base64Data = reader.result.split(',')[1]
            setAttach(base64Data)
        }
        reader.readAsDataURL(file)
        setErrText(null)
    }

    useEffect(() => {
        setCtxVal(prevVal => ({
            ...prevVal,
            openCommunSettings: (commun, role) => openCSModal(commun, role)
        }))
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
                        onClick={() => {
                            setChoosenTab("Bans")
                            bans.length == 0 && fetchBans()
                        }}>
                        Bans
                    </button>
                    {selfRole == "owner" &&
                        <button className={`text-lg text-[#c1c1c1] font-semibold hover:text-purple-300 transition ease-in-out duration-100
                    ${choosenTab == "Mods" ? "text-purple-300 underline font-bold" : ""}`}
                            onClick={
                                () => {
                                    setChoosenTab("Mods")
                                    mods.length == 0 && fetchMods()
                                }}>
                            Mods
                        </button>
                    }
                </div>
                { /* Settings tabs */}
                {choosenTab == "Main" ? (
                    <div className="flex flex-col">
                        <div className="inline-flex items-center justify-center w-full">
                            <div className="flex flex-col">
                                <Image
                                    src={communData && communData.main.pfp ? communData.main.pfp : "/images/default.png"}
                                    width={120}
                                    height={120}
                                    className="rounded-lg mr-4"
                                    alt="Pfp"
                                />
                                <div className="inline-flex items-center w-full">
                                    <label className="cursor-pointer rounded-lg p-1 my-2 font-semibold text-white bg-[#816b9d] hover:bg-[#9179b4] transition-all duration-150 ease-in-out">
                                        <input
                                            type="file"
                                            className="ml-2 text-sm text-white"
                                            onChange={(e) => onAttach(e)}
                                            className="hidden"
                                        />
                                        Upload avatar
                                    </label>
                                </div>
                                <p className="text-white">
                                    {attach ?
                                        "Img attached"
                                        : ""}
                                    {attach &&
                                        <span className="text-purple-300 text-sm ml-2 cursor-pointer" onClick={() => setAttach(null)}>
                                            <br/>
                                            Clear
                                        </span>
                                    }
                                </p>
                            </div>
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
                        {banInput.length > 0 &&
                            <input
                                value={banReason}
                                onChange={(e) => setBanReason(e.target.value)}
                                placeholder="Ban reason"
                                className="mb-2 w-full h-10 rounded-md bg-[#393939] text-white text-lg p-2 font-semibold"
                            />
                        }
                        {bans.length > 0 ? (
                            <div className="w-full flex flex-col">
                                {bans.map((ban) => (
                                    <UserPreview
                                        tag={ban.tag}
                                        bio={ban.reason}
                                        pfp={"none"}
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
                                    textTwo="Banned users cannot post or comment on this community"
                                    scale={280}
                                />
                            </div>
                        )
                        }
                    </div>
                ) : choosenTab == "Mods" ? (
                    <div className="flex flex-col w-[60vw] items-center">
                        <div className="w-full mb-4 flex flex-row gap-3">
                            <input
                                value={modInput}
                                onChange={(e) => setModInput(e.target.value)}
                                placeholder="Input tag..."
                                className="mt-3 w-full h-10 rounded-md bg-[#393939] text-white text-lg p-2 font-semibold"
                            />
                            <Button
                                isSpecial={true}
                                isTextCentered={true}
                                text="Mod"
                                onClick={() => mod()}
                                className="mt-3 px-1"
                            />
                        </div>
                        {mods.length > 0 ? (
                            <div className="w-full flex flex-col">
                                {mods.map((mod) => (
                                    <UserPreview
                                        tag={mod.tag}
                                        specButton="trash"
                                        specFunc={() => unmod(mod.tag)}
                                        key={mod.tag}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="mt-10">
                                <WluffyError
                                    image="wluffy_with_box_light.png"
                                    textOne="No mods"
                                    textTwo="Mods can ban users, delete posts and comments from this community"
                                    scale={280}
                                />
                            </div>
                        )
                        }
                    </div>
                ) : null}
                {errText && <p className="text-red-300 text-sm mt-2">{errText}</p>}
                <Button
                    onClick={choosenTab == "Main" ? () => saveCommun() : choosenTab == "Bans" ? () => { } : null}
                    text="Save"
                    isSpecial={true}
                    isTextCentered={true}
                    className={`${choosenTab == "Bans" || choosenTab == "Mods" ? "hidden" : null} mt-2 w-full`}
                    isDisabled={choosenTab == "Main" ? (!attach) || isBtnDisabled : false}
                />
            </div>
        </div>
    )
}
