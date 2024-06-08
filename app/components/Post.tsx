'use client'
import Image from "next/image"
import axios from "axios";
import { useEffect, useState } from "react";
import PostContextMenu from "./PostContextMenu";
import { on } from "process";

type Props = {
    title: String
    author: String
    community: String
    textContent: String
    reputation: Number
    date: String
    token: String
    postid: Number
    isOpen: boolean
}

export default ({ title, author, community, textContent, reputation, date, token, postid, isOpen }: Props) => {
    const [width, setWidth] = useState(1000)
    const [picked, setPicked] = useState("none")
    const [rep, setRep] = useState(reputation)
    const [isOpened, setIsOpened] = useState(false) // ill use later probably
    const [isContextMenuOpen, setIsContextMenuOpen] = useState(false)
    const [cursorPos, setCursorPos] = useState({x: 0, y: 0})

    const upvote = async (dir) => {
        try {
            if (dir == picked){
                const dbreq = await axios.post("/api/addPostReput", {"token": token, "postid": postid, "isPositive": true, "mode": "remove"})
                setRep(dbreq.data[0])
                setPicked("none")
                return
            }
            let isPositive
            if (dir == "up"){
                isPositive = true
                setPicked("up")
            } else if (dir == "down"){
                isPositive = false
                setPicked("down")
            }
            const dbreq = await axios.post("/api/addPostReput", {"token": token, "postid": postid, "isPositive": isPositive, "mode": "add"})
            setRep(dbreq.data[0])
        }
        catch (err){
            console.error(err)
        }
    }

    useEffect(() => {
    setWidth(window.innerWidth)
    const onDeviceResize = () => {
        setWidth(window.innerWidth)
    }
    addEventListener("resize", onDeviceResize)
    addEventListener("click", onLeftClick)
    addEventListener("contextmenu", onRClickAnywhere)
    if (isOpen){
        setIsOpened(true)
    }
    }, [])

    const onLeftClick = (e) => {
        if (e.target.id == "postsettings") return
        setIsContextMenuOpen(false)
    }

    const onRClickAnywhere = () => {
        setIsContextMenuOpen(false)
    }

    const onRightClick = (e) => {
        e.preventDefault()
        setCursorPos({x: e.clientX, y: e.clientY})
        setTimeout(() => {
            setIsContextMenuOpen(!isContextMenuOpen)
        }, 1)
    }

    return (
    <div className="w-full inline-flex items-start justify-center bg-[#333333] p-2.5 rounded-sm mb-2"
    onContextMenu={(e) => onRightClick(e)}>
        <div className="inline-flex flex-col items-start justify-center w-full">
            <p className="text-2xl font-semibold text-[#dcdcdc] cursor-pointer"
            onClick={() => window.location = `/p/${postid}`}>{title}</p>
            <div className="inline-flex items-center mt-1 justify-between relative w-full h-4">
                <p className="text-sm font-semibold text-[#7c7c7c] truncate cursor-pointer"
                onClick={() => window.location = `/c/${community}`}># {community}</p>
                {width > 400 ? <p className="text-sm font-semibold text-[#757474] truncate cursor-pointer"
                onClick={() => window.location = `/u/${author}`}>@ {author} // {date}</p> : null }
            </div>
            <p className="text-lg mt-1 text-[#dcdcdc]">{textContent}</p>
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
        <PostContextMenu show={isContextMenuOpen} postid={postid} token={token} authortag={author} mousePos={cursorPos} postcommun={community} content={textContent}></PostContextMenu>
    </div>
    )
}