import React, { useState, useEffect, useContext } from "react"
import { mainContext } from "./PageBase"
import Button from "./IconButton"
import UserPreview from "./UserPreview"
import CommunPreview from "./CommunPreview"
import WluffyError from "./WluffyError"
import Post from "./Post"
import axios from "axios"

type Props = {
    isOpen: boolean
}

export default function SearchMenu({ isOpen }: Props) {
    const [data, setData] = useState({acc: [], comm: [], post: []})
    const [isSearched, setIsSearched] = useState(false)
    const { ctxVal, setCtxVal } = useContext(mainContext)
    let token = localStorage.getItem("token")

    const search = async (searchText) => {
        try {
            const fetch = await axios.post("/api/search", { token, text: searchText })
            console.log(fetch.data)
            setData(fetch.data)
            setIsSearched(true)
        }
        catch (err) {
            console.error(err.response.data)
        }
    }

    useEffect(() => {
        setCtxVal(prevVal => ({ ...prevVal, search: (searchText) => search(searchText) }))
    }, [])

    return (
        <div id="backdrop" className={`absolute w-screen h-[100%] bottom-0 left-0 backdrop-blur-sm bg-black bg-opacity-40 flex flex-col items-center ${isOpen ? " " : "hidden"}`}>
            <div className={`w-3/4 p-4 h-fit flex flex-col rounded-xl items-center mt-16 mb-2 bg-[#2a2a2a] bg-opacity-90 overflow-scroll ${data.acc.length == 0 && data.comm.length == 0 && data.post.length == 0 && !isSearched ? "hidden" : " "} `}>
                {data.acc.length > 0 && <p className="text-[#8f8f8f] text-xl mb-2 font-bold">Users</p>}
                {data.acc.length > 0 &&
                    data.acc.map((acc) =>
                        <UserPreview
                            key={acc.id}
                            nick={acc.nick}
                            tag={acc.tag}
                            bio={acc.bio}
                            pfp={acc.pfp}
                        />
                    )
                }
                {data.comm.length > 0 && <p className="text-[#8f8f8f] text-xl mb-2 font-bold">Communities</p>}
                {data.comm.length > 0 &&
                    data.comm.map((comm) =>
                        <CommunPreview
                            key={comm.id}
                            tag={comm.tag}
                        />
                    )
                }
                {data.post.length > 0 && <p className="text-[#8f8f8f] text-xl mb-2 font-bold">Posts</p>}
                {data.post.length > 0 &&
                    data.post.map((post) =>
                        <Post
                            key={post.id}
                            title={JSON.parse(post.content)['title']}
                            author={post.authortag}
                            date={post.date}
                            textContent={JSON.parse(post.content)['text']}
                            reputation={post.reputation}
                            community={post.commun}
                            token={token}
                            postid={post.id}
                            isOpen={false}
                            attach={JSON.parse(post.content)['attach']}
                        />
                    )
                }
                { data.acc.length == 0 && data.comm.length == 0 && data.post.length == 0 && isSearched &&
                    <WluffyError
                        image="wluffy_with_box_light.png"
                        textOne="Nothing found"
                        textTwo="Try a different search?"
                    />
                }
            </div>
        </div>
    )
}
