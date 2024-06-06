import { useState, useEffect } from "react"
import axios from "axios"

let isOpenOu = false

export default function WriteModal() {
    const [title, setTitle] = useState()
    const [textContent, setTextContent] = useState()
    const [communs, setCommuns] = useState(['Fetching'])
    const [choosenCommun, setChoosenCommun] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [errText, setErrText] = useState(null)
    let token = localStorage.getItem("token")

    useEffect(() => {
        fetchCommuns()
        const interval = setInterval(() => {
            if (isOpenOu) {
                isOpenOu = false
                setIsOpen(true)
            }
        }, 100)
    }, [])

    const fetchCommuns = async () => {
        try {
            const fetch = await axios.post("/api/getUserCommuns", { token })
            const data = fetch.data
            setCommuns(data)
            console.log(data)
            setChoosenCommun(data[0])
        } catch (err) {
            console.error(err.response.data)
            if (err.response.data == "No communities") {
                setCommuns(["No communities"])
            }
        }
    }

    const onLeftClick = (e) => {
        if (e.target.id == "backdrop") {
            setIsOpen(false)
        }
    }

    const Post = async () => {
        try {
            let content = {
                title,
                text: textContent
            }
            console.log("post sent")
            const fetch = await axios.post("/api/createPost", { token, commun : choosenCommun, content })
            const data = fetch.data
            console.log(data)
            setErrText(null)
            setIsOpen(false)
        } catch (err) {
            console.error(err.response.data)
            setErrText(err.response.data)
        }
    }

    return (
        <div id="backdrop" className={`absolute w-screen h-screen top-0 left-0 z-30 backdrop-blur-sm bg-black bg-opacity-10 flex flex-col items-center justify-center ${isOpen ? " " : "hidden"}`}
            onClick={(e) => onLeftClick(e)}>
            <div className="flex flex-col bg-[#4b4b4b] p-2 rounded-lg shadow-sm w-[50%] h-[80%]">
                <p className="text-white font-semibold text-2xl">Write a post</p>
                <select className="bg-[#393939] text-white mt-1 p-1 rounded-lg" onChange={(e) => setChoosenCommun(e.target.value)}>
                    {communs[0] != "Fetching" && communs[0] != "No communities" ? (
                        communs.map((community) => (
                            <option key={community} value={community}>{community}</option>
                        ))
                    ) : communs == "No communities" ? (
                        <option selected={true} disabled={true}>No communities</option>
                    ) : null}
                </select>
                <input
                    type="text"
                    placeholder="Title"
                    className="mt-3 w-full h-10 rounded-md bg-[#393939] text-white text-lg p-2 font-semibold"
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    type="text"
                    placeholder="Text content (description)"
                    className="mt-3 w-full h-10 rounded-md bg-[#393939] text-white text-sm p-2 h-full"
                    onChange={(e) => setTextContent(e.target.value)}
                    row={5}
                />
                {errText ? <p className="text-red-300 text-sm mt-2">{errText}</p> : null}
                <button
                    className="mt-3 w-full h-10 rounded-md bg-[#816b9d] hover:bg-[#77658e] text-white text-sm p-2 font-semibold transition ease-in-out duration-300"
                    onClick={() => Post()}
                >Post</button>
            </div>
        </div>
    )
}

export function openWriteModal() {
    isOpenOu = true
}
