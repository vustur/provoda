import Post from "./Post";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

type Props = {
  id : Number
}

export default function PostsTab({ id }: Props) {
    const [width, setWidth] = useState(1000)
    const [postData, setPostData] = useState(["Fetching"])
    let token = localStorage.getItem("token")

    useEffect(() => {
        setWidth(window.innerWidth)
        const onDeviceResize = () => {
            setWidth(window.innerWidth)
        }
    addEventListener("resize", onDeviceResize)
    fetchPost(id)
    }, [])

    const fetchPost = async (id) => {
      try {
        const fetch = await axios.post("/api/getPost", { id })
        const data = fetch.data
        console.log(data)
        setPostData(data)
      } catch (err) {
        console.error(err.response.data)
        if (err.response.data == "Not found") {
          setPostData(["Not found"])
        }
      }
    }

    return (
      <div className="inline-flex flex-col space-y-3 items-center justify-start bg-[#363636] w-full h-full px-[15px] pt-3 rounded-tr-xl">
        { postData != "Fetching" && postData != "Not found" ?(
        <Post                 
          title={postData.content.title}
          author={postData.authortag}
          date={new Date(postData.date).toLocaleString('ru-RU', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(':00 ', ' ')}
          textContent={postData.content.text}
          reputation={postData.reputation}
          community={postData.commun}
          token={token}
          postid={postData.id}
          isFS={true}
        />
        ) : null }
      </div>
    )
}