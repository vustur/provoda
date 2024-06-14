import React, { useState, useEffect, useContext } from "react"
import { mainContext } from "./PageBase"
import Button from "./IconButton"
import axios from "axios"

export default function WriteModal() {
    const [title, setTitle] = useState()
    const [textContent, setTextContent] = useState()
    const [communs, setCommuns] = useState(['Fetching'])
    const [choosenCommun, setChoosenCommun] = useState(null)
    const [isOpen, setIsOpen] = useState(false)
    const [errText, setErrText] = useState(null)
    const [isDropdown, setIsDropdown] = useState(true)
    const [writeType, setWriteType] = useState("write") // write or edit
    const [origPostId, setOrigPostId] = useState(null)
    const [isBtnDisabled, setIsBtnDisabled] = useState(false)
    const { ctxVal, setCtxVal } = useContext(mainContext)
    let token = localStorage.getItem("token")

    const openWriteModal = (type, newContent, postId) => {
        setIsOpen(true)
        setWriteType(type)
        fetchCommuns()
        if (newContent) {
            setTextContent(newContent)
        }
        if (postId) {
            setOrigPostId(postId)
        }
    }

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
            setIsBtnDisabled(true)
            let content = {
                title,
                text: textContent
            }
            const fetch = await axios.post("/api/createPost", { token, commun: choosenCommun, content })
            const data = fetch.data
            console.log(data)
            setErrText(null)
            setIsOpen(false)
            setTitle(null)
            setTextContent(null)
            ctxVal.refreshPosts()
            setIsBtnDisabled(false)
        } catch (err) {
            console.error(err.response.data)
            setErrText(err.response.data)
            setIsBtnDisabled(false)
        }
    }

    const EditPost = async () => {
        try {
            setIsBtnDisabled(true)
            const fetch = await axios.post("/api/editPost", { token, postid: origPostId, textContent })
            const data = fetch.data
            console.log(data)
            setErrText(null)
            setIsOpen(false)
            setOrigPostId(null)
            setTitle(null)
            setTextContent(null)
            ctxVal.refreshPosts()
            setIsBtnDisabled(false)
        } catch (err) {
            console.error(err)
            setErrText(err.response.data)
            setIsBtnDisabled(false)
        }
    }

    useEffect(() => {
        setCtxVal(prevVal => ({ ...prevVal, openWriteFunc: openWriteModal }))
    }, [])

    return (
        <div id="backdrop" className={`absolute w-screen h-screen top-0 left-0 z-30 backdrop-blur-sm bg-black bg-opacity-10 flex flex-col items-center justify-center ${isOpen ? " " : "hidden"}`}
            onClick={(e) => onLeftClick(e)}>
            <div className="flex flex-col bg-[#414141] p-2 rounded-lg shadow-sm w-[50%] h-[80%]">
                <p className="mb-2 text-white font-semibold text-2xl text-center">{writeType == "write" ? "Write post" : "Edit post"}</p>
                {writeType == "write" ?
                    <div className="inline-flex items-center w-full h-16">
                        <Button
                            src={isDropdown ? "search" : "house"}
                            onClick={() => setIsDropdown(!isDropdown)}
                            isSpecial={true}
                        />
                        {isDropdown ? (
                            <select className="bg-[#393939] text-white ml-2 w-full h-full p-1 rounded-lg" onChange={(e) => setChoosenCommun(e.target.value)}>
                                {communs[0] != "Fetching" && communs[0] != "No communities" ? (
                                    communs.map((community) => (
                                        <option key={community} value={community}>{community}</option>
                                    ))
                                ) : communs == "No communities" ? (
                                    <option selected={true} disabled={true}>No communities</option>
                                ) : null}
                            </select>
                        ) : (
                            <input
                                type="text"
                                placeholder="Community tag"
                                className="w-full h-full ml-2 rounded-md bg-[#393939] text-white text-lg p-1"
                                onChange={(e) => setChoosenCommun(e.target.value)}
                            />
                        )}
                    </div>
                    : null}
                {writeType == "write" ?
                    <input
                        type="text"
                        placeholder="Title"
                        className="mt-3 w-full h-10 rounded-md bg-[#393939] text-white text-lg p-2 font-semibold"
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    : null}
                <textarea
                    type="text"
                    placeholder="Text content (description)"
                    className="mt-3 w-full rounded-md bg-[#393939] text-white text-sm p-2 h-full"
                    onChange={(e) => setTextContent(e.target.value)}
                    row={5}
                />
                {errText ? <p className="text-red-300 text-sm mt-2">{errText}</p> : null}
                {/* <button
                    className="mt-3 w-full rounded-md bg-[#816b9d] hover:bg-[#77658e] text-white text-sm p-2 font-semibold transition ease-in-out duration-300 truncate"
                    onClick={writeType == "write" ? () => Post() : () => EditPost()}
                >{writeType == "write" ? `Post to ${choosenCommun}` : `Edit post ${origPostId}`}</button> */}
                <Button
                    onClick={writeType == "write" ? () => Post() : () => EditPost()}
                    text={writeType == "write" ? `Post to ${choosenCommun}` : `Edit post ${origPostId}`}
                    isSpecial={true}
                    className="mt-2 w-full text-center"
                    isTextCentered={true}
                    isDisabled={isBtnDisabled}>
                </Button>
            </div>
        </div>
    )
}
