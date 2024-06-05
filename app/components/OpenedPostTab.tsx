import Post from "./Post";
import Comment from "./Comment";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

type Props = {
  id : Number
}

export default function PostsTab({ id }: Props) {
    const [width, setWidth] = useState(1000)
    const [postData, setPostData] = useState(["Fetching"])
    const [comments, setComments] = useState(["Fetching"])
    let token = localStorage.getItem("token")

    useEffect(() => {
        setWidth(window.innerWidth)
        const onDeviceResize = () => {
            setWidth(window.innerWidth)
        }
    addEventListener("resize", onDeviceResize)
    fetchPost(id)
    fetchComments(id)
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
        } else {
          setPostData(["Error"])
        }
      }
    }

    const fetchComments = async (id) => {
      try {
        const fetch = await axios.post("/api/getPostComments", { postid : id })
        const data = fetch.data
        console.log(data)
        setComments(data)
      } catch (err) {
        console.error(err.response.data)
        if (err.response.data == "No comments") {
          setComments(["None"])
        } else if (err.response.data == "Post not found") {
          setComments(["Post not found"])
        }
      }
    }

    return (
      <div className="inline-flex flex-col space-y-3 items-center justify-start bg-[#363636] w-full h-full px-[15px] pt-3 rounded-tr-xl pb-16"
      style={{ overflowY: "scroll" }}>
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
          isOpen={true}
        />
        ) : postData == "Fetching" ? (
          <p className="text-xl font-semibold text-[#545454] text-center">Fetching posts...</p>
        ) : postData == "Not found" ? (
        <div className="inline-flex flex-col ml-5 mr-3 items-center justify-center">
          <Image
          src={"/images/wluffy_wires_light.png"}
          width={300}
          height={300}
          className="rounded-2xl mb-2 grayscale-1 brightness-50 opacity-40 mt-14"
          />
          <p className="text-xl font-semibold text-[#545454] text-center">Post not found...</p>
        </div>
        ) : null}
        { comments != "Fetching" && postData != "Not found" && postData != "Error" ? (
          <p className="text-lg font-semibold text-[#727272] w-full pl-2">
            Comments
          </p>
        ) : null}
        { comments != "Fetching" && comments != "None" && comments != "Post not found" && postData != "Not found" && postData != "Error" ? (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              authortag={comment.authortag}
              textContent={comment.text}
              date={new Date(comment.date).toLocaleString('ru-RU', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(':00 ', ' ')}
              postid={comment.postid}
              reputation={comment.reputation}
            />
          ))
        ) : comments == "Fetching" ? (
          <p className="text-xl font-semibold text-[#545454] text-center">Fetching comments...</p>
        ) : comments == "None" ? (
          <p className="text-2xl font-semibold text-[#545454] text-center">No comments<br/>
          <span className="text-base">Be the first to comment</span></p>
        ) : null
        }
      </div>
    )
}