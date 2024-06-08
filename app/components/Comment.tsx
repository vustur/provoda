import Image from "next/image"
import { useEffect, useState } from "react"

type Props = {
    authortag: string
    textContent: string
    date: string
    postid: number
    reputation: number
    showOrig: boolean
    postTitle: string
}

export default function main({ authortag, textContent, date, postid, reputation, showOrig, postTitle }: Props) {
    const [width, setWidth] = useState(1000)

    useEffect(() => {
        setWidth(window.innerWidth)
        const onDeviceResize = () => {
            setWidth(window.innerWidth)
        }
    addEventListener("resize", onDeviceResize)
    }, [])

    const upvote = async() => {
        null // todo
    }

    return (
        <div className="w-full inline-flex items-start justify-center bg-[#2d2d2d] p-2.5 rounded-xl">
        <div className="inline-flex flex-col items-start justify-center w-full">
        {showOrig ? <p className="text-sm font-semibold text-[#b9b9b9] cursor-pointer" onClick={() => window.location = `/p/${postid}`}>## {postid}</p> : null}
            <div className={`inline-flex relative w-full h-fit ${ width > 400 ? "justify-between" : "flex-col"} `}>
                <p className="text-base font-semibold text-[#8a8a8a] truncate cursor-pointer"
                onClick={() => window.location = `/u/${authortag}`}>@ {authortag}</p>
                <p className="text-sm font-semibold text-[#757474] truncate cursor-pointer">
                {date}</p>
            </div>
            <p className="text-lg text-[#dcdcdc]">{textContent}</p>
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
            <p className="text-md font-bold text-[#f2f2f2]">{reputation.toString()}</p>
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