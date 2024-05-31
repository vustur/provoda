'use client'
import Image from "next/image"
import axios from "axios";
import { useEffect, useState } from "react";

type Props = {
    title: String
    author: String
    community: String
    textContent: String
    reputation: Number
    date: String
    token: String
    postid: Number
}

export default ({ title, author, community, textContent, reputation, date, token, postid }: Props) => {
    const [width, setWidth] = useState(1000)
    const [picked, setPicked] = useState("none")
    const [rep, setRep] = useState(reputation)

    const upvote = async (dir) => {
        try {
            if (dir == picked){
                const dbreq = await axios.post("/api/addPostReput", {"token": token, "postid": postid, "isPositive": true, "mode": "remove"})
                // setRep(dbreq[0])
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
            console.log(isPositive)
            const dbreq = await axios.post("/api/addPostReput", {"token": token, "postid": postid, "isPositive": isPositive, "mode": "add"})
            // setRep(dbreq[0])
            console.log(dbreq.data[0])
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
    })

    return (
    <div className="w-full inline-flex items-start justify-center bg-[#333333] p-2.5 rounded-sm">
        <div className="inline-flex flex-col items-start justify-center w-full">
            <p className="text-2xl font-semibold text-[#dcdcdc]">{title}</p>
            <div className="inline-flex items-center mt-1 justify-between relative w-full h-4">
                <p className="text-sm font-semibold text-[#7c7c7c] truncate"># {community}</p>
                {width > 400 ? <p className="text-sm font-semibold text-[#757474] truncate">@ {author} // {date}</p> : null }
            </div>
            <p className="text-lg mt-1 text-[#dcdcdc]">{textContent}</p>
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
        </div>
    </div>
    )
}