import React, { useState, useEffect, useContext } from "react"
import Image from "next/image"
import { mainContext } from "./PageBase"
import Cookies from "js-cookie"

export default function PictureModal() {
    const [isOpen, setIsOpen] = useState(false)
    const { ctxVal, setCtxVal } = useContext(mainContext)
    const [url, setUrl] = useState(null)
    let token = Cookies.get("token") || null

    const openPVModal = (url) => {
        setIsOpen(true)
        setUrl(url)
    }

    const onLeftClick = (e) => {
        if (e.target.id == "backdrop") {
            setIsOpen(false)
            setUrl(null)
        }
    }

    useEffect(() => {
        setCtxVal(prevVal => ({ ...prevVal, openPictureView: (url) => openPVModal(url) }))
    }, [])

    return (
        <div id="backdrop" className={`absolute w-screen h-screen top-0 left-0 z-30 backdrop-blur-sm bg-black bg-opacity-10 flex flex-col items-center justify-center ${isOpen ? " " : "hidden"}`}
            onClick={(e) => onLeftClick(e)}>
            <div className="rounded-lg shadow-sm">
                {url &&
                    <Image
                        src={url}
                        height={600}
                        width={600}
                        quality={70}
                        alt="Image from ImageViewModal"
                    />
                }
            </div>
        </div>
    )
}
