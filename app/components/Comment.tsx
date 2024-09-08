import Image from "next/image"
import axios from "axios"
import { useEffect, useState } from "react"
import CommntContextMenu from "./CommntContextMenu"
import Comment from "./Comment"
import Avatar from "./Avatar"
import { parseTextToPMD } from "./utils"

type Props = {
    authortag: string
    content: any
    date: string
    postid: number
    reputation: number
    showOrig: boolean
    commid: number
    // replies: any // replies used for old comment reply system
    pfp: String
    replyto: number
    allComs: any
    ownStatus: number
}

export default function main({ authortag, content, date, postid, reputation, showOrig, commid, pfp, replyto, allComs, ownStatus }: Props) {
    const [width, setWidth] = useState(1000)
    const [picked, setPicked] = useState("none")
    const [rep, setRep] = useState(reputation)
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
    const [showReplies, setShowReplies] = useState(true)
    const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 })
    const [replies, setReplies] = useState([])
    let token = typeof window !== "undefined" ? (window.localStorage.getItem("token") != null ? window.localStorage.getItem('token') : null) : null

    useEffect(() => {
        setWidth(window.innerWidth)
        const onDeviceResize = () => {
            setWidth(window.innerWidth)
        }
        addEventListener("resize", onDeviceResize)
        addEventListener("click", onLeftClick)
        addEventListener("contextmenu", onRClickAnywhere)
        if (replies.length == 0 && allComs) {
            for (const replyElm of allComs) {
                if (replyElm.replyto == commid) {
                    // console.log(replyElm)
                    setReplies(prevVal => ([...prevVal, replyElm]))
                }
            }
        }
    }, [])

    const upvote = async (dir) => {
        if (!token){
            alert("Login to upvote/downvote")
        }
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

    return (
        <div className="flex flex-col w-full bg-[#2f2f2f] my-2 rounded-xl pb-1">
            <div className="w-full h-full flex flex-row">
                <div className="inline-flex w-full items-start justify-center p-1.5"
                    onContextMenu={(e) => onRightClick(e)}>
                    {!showOrig &&
                        <Avatar
                            src={pfp}
                            size={3}
                            pixels={80}
                        />
                    }
                    <div className="inline-flex flex-col items-start w-full h-full">
                        {showOrig ? <p className="text-sm font-semibold text-[#b9b9b9] cursor-pointer" onClick={() => window.location = `/p/${postid}`}>## {postid}</p> : null}
                        <p className="text-base font-semibold text-[#8a8a8a] cursor-pointer"
                            onClick={() => window.location = `/u/${authortag}`}>@ {authortag} <span className="text-[#555555] ml-2 truncate">{date}</span></p>
                        <p className="text-lg text-[#dcdcdc]"
                            style={{ whiteSpace: "pre-wrap" }}
                        dangerouslySetInnerHTML={{__html: parseTextToPMD(content.text)}}></p>
                    </div>
                    <div className="inline-flex flex-col ml-5 mr-3 items-center justify-center relative w-5 h-fit">
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
                    <CommntContextMenu show={isContextMenuOpen} commid={commid} token={token} authortag={authortag} mousePos={cursorPos} content={content.text} ownStatus={ownStatus} />
                </div>
            </div>
            {replies && replies.length != 0 &&
                <p className="text-sm font-semibold text-[#4b4b4b] cursor-pointer ml-2 mb-2" onClick={() => setShowReplies(!showReplies)}>{showReplies ? "Hide replies" : "Show replies"}</p>
            }
            <div className="h-full w-full flex flex-row">
                {replies.length != 0 && showReplies &&
                    <div className="bg-[#4e4e4e] border border-[#4e4e4e] w-[2px] h-full mx-2"></div>
                }
                <div className="flex flex-col w-full h-full">
                    {replies.length != 0 && showReplies &&
                        replies.map((reply) => {
                            return (
                                <Comment
                                    key={reply.id}
                                    authortag={reply.authortag}
                                    content={reply.content}
                                    date={reply.date}
                                    postid={reply.postid}
                                    reputation={reply.reputation}
                                    commid={reply.id}
                                    replyto={commid}
                                    allComs={allComs}
                                    ownStatus={reply.ownStatus}
                                />
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}