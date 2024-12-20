import React, { useState, useEffect, useContext } from "react"
import { mainContext } from "./PageBase"
import Image from "next/image"
import Button from "./IconButton"
import axios from "axios"
import Avatar from "./Avatar"
import { checkUpl } from "./utils"
import Cookies from "js-cookie"

export default function AccSettings() {
    const [isOpen, setIsOpen] = useState(false)
    const [errText, setErrText] = useState(null)
    const [userData, setUserData] = useState(null)
    const [newNick, setNewNick] = useState("")
    const [newBio, setNewBio] = useState("")
    const [newMail, setNewMail] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [currentPassword, setCurrentPassword] = useState("")
    const [attach, setAttach] = useState(null)
    const [choosenTab, setChoosenTab] = useState("Profile")
    const [isBtnDisabled, setIsBtnDisabled] = useState(false)
    const { ctxVal, setCtxVal } = useContext(mainContext)
    let token = Cookies.get("token") || null

    const openASModal = () => {
        setIsOpen(true)
        if (userData == null) {
            fetchAccount()
        }
    }

    const onLeftClick = (e) => {
        if (e.target.id == "backdrop") {
            setIsOpen(false)
        }
    }

    const fetchAccount = async () => {
        try {
            const req = await axios.post("/api/getAccount", { "input": token })
            const data = req.data[0]
            console.log(data)
            setUserData(data)
        }
        catch (err) {
            console.error(err.response.data)
        }
    }

    const saveProfile = async () => {
        try {
            setIsBtnDisabled(true)
            const sendNick = newNick ? newNick : null
            const sendBio = newBio ? newBio : null
            const sendAvatar = attach ? attach : null
            const req = await axios.post("/api/editAccount", { token, newNick: sendNick, newBio: sendBio, newAvatar: sendAvatar })
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

    const saveDanger = async () => {
        try {
            setIsBtnDisabled(true)
            const sendMail = newMail ? newMail : null
            const sendNwPass = newPassword ? newPassword : null
            const sendCrPass = currentPassword ? currentPassword : null
            const req = await axios.post("/api/editAccount", { token, newMail: sendMail, newPass: sendNwPass, pass: sendCrPass })
            const data = req.data
            console.log(data)
            setErrText(null)
            setIsOpen(false)
            setIsBtnDisabled(false)
            if (data.token != 'none') {
                alert('Your token has been updated')
                Cookies.set("token", data.token)
            }
        }
        catch (err) {
            console.error(err.response.data)
            setErrText(err.response.data)
            setIsBtnDisabled(false)
        }
    }

    const onAttach = (e) => {
        try {
            checkUpl(e, setAttach)
            setErrText(null)
        }
        catch (e) {
            setErrText(e.message)
        }
    }

    useEffect(() => {
        setCtxVal(prevVal => ({ ...prevVal, openAccountSettings: () => openASModal() }))
    }, [])

    return (
        <div id="backdrop" className={`absolute w-screen h-screen top-0 left-0 z-30 backdrop-blur-sm bg-black bg-opacity-10 flex flex-col items-center justify-center ${isOpen ? " " : "hidden"}`}
            onClick={(e) => onLeftClick(e)}>
            <div className="flex flex-col bg-[#414141] p-3 rounded-lg shadow-sm w-fit">
                <p className="text-2xl font-semibold text-[#f1f1f1] w-full text-center">Settings</p>
                <div className="w-full mb-3 inline-flex items-center justify-center gap-4">
                    <button className={`text-lg text-[#c1c1c1] font-semibold hover:text-purple-300 transition ease-in-out duration-100
                    ${choosenTab == "Profile" ? "text-purple-300 underline font-bold" : ""}`}
                        onClick={() => setChoosenTab("Profile")}>
                        Profile
                    </button>
                    <button className={`text-lg text-[#c1c1c1] font-semibold hover:text-purple-300 transition ease-in-out duration-100
                    ${choosenTab == "Danger" ? "text-purple-300 underline font-bold" : ""}`}
                        onClick={() => setChoosenTab("Danger")}>
                        Danger
                    </button>
                </div>
                { /* Settings tabs */}
                {choosenTab == "Profile" ? (
                    <div className="flex flex-col">
                        <div className="inline-flex items-center justify-center w-full">
                            <div className="flex flex-col items-center">
                                <Avatar
                                    src={userData && userData.pfp && userData.pfp}
                                    size={5}
                                    pixels={80}
                                    nomargin={true}
                                />
                                <div className="inline-flex items-center w-full">
                                    <label className="cursor-pointer rounded-lg p-1 my-2 font-semibold text-white bg-[#816b9d] hover:bg-[#9179b4] transition-all duration-150 ease-in-out">
                                        <input
                                            type="file"
                                            className="ml-2 text-sm text-white"
                                            onChange={(e) => onAttach(e)}
                                            className="hidden"
                                            value={undefined}
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
                                            <br />
                                            Clear
                                        </span>
                                    }
                                </p>
                            </div>
                            <div className="ml-2">
                                <input
                                    value={newNick}
                                    onChange={(e) => setNewNick(e.target.value)}
                                    placeholder="Nickname"
                                    className="mt-3 w-full h-10 rounded-md bg-[#393939] text-white text-lg p-2 font-semibold"
                                />
                                <p className="text-lg font-semibold text-[#7c7c7c] my-2">
                                    @ {userData?.tag}
                                </p>
                                <p className="text-sm font-semibold text-[#656565] my-2">
                                    User id: {userData?.id}
                                </p>
                            </div>
                        </div>
                        <textarea
                            value={newBio}
                            onChange={(e) => setNewBio(e.target.value)}
                            placeholder="Bio"
                            className="mt-3 w-full h-24 rounded-md bg-[#393939] text-white text-lg p-2 font-semibold"
                        />
                    </div>
                ) : choosenTab == "Danger" ? (
                    <div className="flex flex-col">
                        <input
                            value={newMail}
                            onChange={(e) => setNewMail(e.target.value)}
                            placeholder="Mail"
                            className="mt-3 w-full h-10 rounded-md bg-[#393939] text-white text-lg p-2 font-semibold"
                        />
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New password"
                            className="mt-3 w-full h-10 rounded-md bg-[#393939] text-white text-lg p-2 font-semibold"
                        />
                        <p className="text-sm font-semibold text-[#919191] my-2">
                            To change danger zone, you should provide your current password. Also, your token will be changed after editing these settings
                        </p>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Current password"
                            className="     w-full h-10 rounded-md bg-[#393939] text-white text-lg p-2 font-semibold"
                        />
                    </div>
                ) : null}
                {errText && <p className="text-red-300 text-sm mt-2">{errText}</p>}
                <Button
                    onClick={choosenTab == "Profile" ? saveProfile : choosenTab == "Danger" ? saveDanger : null}
                    text="Save"
                    isSpecial={true}
                    className="mt-2 w-full"
                    isTextCentered={true}
                    isDisabled={choosenTab == "Profile" ? (!newNick && !newBio && !attach) && !isBtnDisabled : choosenTab == "Danger" ? (!newMail && !newPassword && !currentPassword) && !isBtnDisabled : null}
                />
            </div>
        </div>
    )
}
