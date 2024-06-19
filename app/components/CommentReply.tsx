import Image from "next/image"
import axios from "axios"
import { useEffect, useState } from "react"
import CommntContextMenu from "./CommntContextMenu"

type Props = {
    authortag: string
    textContent: string
    date: string
    postid: number
    reputation: number
    showOrig: boolean
    commid: number
}

export default function main({ authortag, textContent, date, postid, reputation, showOrig, commid }: Props) {
    const [width, setWidth] = useState(1000)
    const [picked, setPicked] = useState("none")
    const [rep, setRep] = useState(reputation)
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
    let token = typeof window !== "undefined" ? window.localStorage.getItem('token') : null

    useEffect(() => {
        setWidth(window.innerWidth)
        const onDeviceResize = () => {
            setWidth(window.innerWidth)
        }
        addEventListener("resize", onDeviceResize)
        addEventListener("click", onLeftClick)
        addEventListener("contextmenu", onRClickAnywhere)
    }, [])

    const upvote = async (dir) => {
        try {
            if (dir == picked) {
                const dbreq = await axios.post("/api/addCommReput", { "token": token, "commid": commid, "isPositive": true, "mode": "remove" })
                setRep(dbreq.data[0])
                console.log(dbreq.data[0])
                setPicked("none")
                return
            }
            let isPositive
            if (dir == "up") {
                isPositive = true
                setPicked("up")
            } else if (dir == "down") {
                isPositive = false
                setPicked("down")
            }
            const dbreq = await axios.post("/api/addCommReput", { "token": token, "commid": commid, "isPositive": isPositive, "mode": "add" })
            setRep(dbreq.data[0])
            console.log(dbreq.data[0])
        }
        catch (err) {
            console.error(err.response.data)
        }
    }

    const onLeftClick = (e) => {
        if (e.target.id == "postsettings") return
        setIsContextMenuOpen(false)
    }

    const onRClickAnywhere = () => {
        setIsContextMenuOpen(false)
    }

    const onRightClick = (e) => {
        e.preventDefault()
        setCursorPos({ x: e.clientX, y: e.clientY })
        setTimeout(() => {
            setIsContextMenuOpen(!isContextMenuOpen)
        }, 1)
    }

    const fetchReplies = async () => {
        try {

        }
        catch (err) {
            console.error(err.response.data)
        }
    }

    return (
        <div className="flex flex-row w-full bg-[#2d2d2d] my-2 rounded-xl">
            <div className="bg-[#4e4e4e] border-1 w-[2px] h-full mx-3"></div>
            <div className="inline-flex items-start justify-center my-1.5 p-2.5 w-full"
                onContextMenu={(e) => onRightClick(e)}>
                <div className="inline-flex flex-col items-start justify-center w-full h-full">
                    {showOrig ? <p className="text-sm font-semibold text-[#b9b9b9] cursor-pointer" onClick={() => window.location = `/p/${postid}`}>## {postid}</p> : null}
                    <div className={`inline-flex relative w-full h-fit ${width > 400 ? "justify-between" : "flex-col"} `}>
                        <p className="text-base font-semibold text-[#8a8a8a] truncate cursor-pointer"
                            onClick={() => window.location = `/u/${authortag}`}>@ {authortag}</p>
                        <p className="text-sm font-semibold text-[#757474] truncate cursor-pointer">
                            {date}</p>
                    </div>
                    <p className="text-lg text-[#dcdcdc]"
                    style={{ whiteSpace: "pre-wrap" }}
                    >{textContent}</p>
                </div>
                <div className="inline-flex flex-col ml-5 mr-3 items-center justify-center relative w-6 h-fit">
                    <Image
                        src={"/icons/chevron_up.svg"}
                        alt="Up"
                        height={32}
                        width={32}
                        className="cursor-pointer"
                        onClick={() => upvote("up")}
                    />
                    <p className="text-md font-bold text-[#f2f2f2]">{rep.toString()}</p>
                    <Image
                        src={"/icons/chevron_up.svg"}
                        alt="Up"
                        height={32}
                        width={32}
                        className="rotate-180 cursor-pointer"
                        onClick={() => upvote("down")}
                    />
                    <Image
                        src={"/icons/adjst.svg"}
                        alt="Up"
                        height={32}
                        width={32}
                        className="cursor-pointer opacity-40"
                        id="postsettings"
                        onClick={(e) => onRightClick(e)}
                    />
                </div>
                <CommntContextMenu show={isContextMenuOpen} commid={commid} token={token} authortag={authortag} mousePos={cursorPos} content={textContent} isreply={true}></CommntContextMenu>
            </div>
        </div>
    )
}