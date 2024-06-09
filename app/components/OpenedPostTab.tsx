import Post from "./Post";
import Comment from "./Comment";
import { useEffect, useState, useContext } from "react";
import { mainContext } from "./PageBase"
import axios from "axios";
import WluffyError from "./WluffyError";
import Image from "next/image";

type Props = {
  id: Number
}

export default function PostsTab({ id }: Props) {
  const [width, setWidth] = useState(1000)
  const [postData, setPostData] = useState(["Fetching"])
  const [comments, setComments] = useState(["Fetching"])
  const [commentInput, setCommentInput] = useState("")
  const [isShift, setIsShift] = useState(false)
  const [inEditCommId, setInEditCommId] = useState(0)
  const { ctxVal, setCtxVal } = useContext(mainContext)
  let token = localStorage.getItem("token")

  useEffect(() => {
    setWidth(window.innerWidth)
    const onDeviceResize = () => {
      setWidth(window.innerWidth)
    }
    addEventListener("resize", onDeviceResize)
    window.addEventListener("keypress", (e) => {
      if (e.key == "Shift") {
        setIsShift(true)
      }
    })
    window.addEventListener("keyup", (e) => {
      if (e.key == "Shift") {
        setIsShift(false)
      }
    })
    refresh()
    setCtxVal(prevVal => ({ ...prevVal, refreshPosts: () => refresh() }))
    setCtxVal(prevVal => ({ ...prevVal, refresh: () => fetchComments(id) }))
    setCtxVal(prevVal => ({
      ...prevVal, editComment: (content, commid) => {
        setCommentInput(content)
        setInEditCommId(commid)
      }
    }))
  }, [])

  const refresh = () => {
    fetchPost(id)
    fetchComments(id)
  }

  const fetchPost = async (id) => {
    try {
      const fetch = await axios.post("/api/getPost", { id })
      const data = fetch.data.post
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
      const fetch = await axios.post("/api/getPostComments", { postid: id })
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

  const submitComment = async () => {
    try {
      setCommentInput("")
      const fetch = await axios.post("/api/createComm", { postid: id, text: commentInput, token })
      const data = fetch.data
      console.log(data)
      refresh()
    } catch (err) {
      console.error(err.response.data)
    }
  }

  const editComment = async () => {
    try {
      setCommentInput("")
      setInEditCommId(0)
      const fetch = await axios.post("/api/editComm", { commid: inEditCommId, text: commentInput, token })
      const data = fetch.data
      console.log(data)
      refresh()
    } catch (err) {
      console.error(err.response.data)
    }
  }

  return (
    <div className="inline-flex flex-col space-y-3 items-center justify-start bg-[#363636] w-full h-full px-[15px] pt-3 rounded-tr-xl pb-16"
      style={{ overflowY: "scroll" }}>
      <div className="inline-flex flex-col items-start justify-start w-full h-[90%] overflow-scroll">
        {postData != "Fetching" && postData != "Not found" ? (
          <Post
            title={postData.content.title}
            author={postData.authortag}
            date={postData.date}
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
          <WluffyError
            image="wluffy_wires_light.png"
            textOne="Post not found"
          />
        ) : null}
        {comments != "Fetching" && postData != "Not found" && postData != "Error" ? (
          <p className="text-lg font-semibold text-[#727272] w-full pl-2">
            Comments
          </p>
        ) : null}
        {comments != "Fetching" && comments != "None" && comments != "Post not found" && postData != "Not found" && postData != "Error" ? (
          comments.map((comment) => (
            <Comment
              key={comment.id}
              authortag={comment.authortag}
              textContent={comment.text}
              date={comment.date}
              postid={comment.postid}
              reputation={comment.reputation}
              commid={comment.id}
            />
          ))
        ) : comments == "Fetching" ? (
          <p className="text-xl font-semibold text-[#545454] text-center">Fetching comments...</p>
        ) : comments == "None" ? (
          <p className="text-2xl font-semibold text-[#545454] text-center">No comments<br />
            <span className="text-base">Be the first to comment</span></p>
        ) : null
        }
      </div>
      {inEditCommId != 0 ? (
        <p className="text-sm w-full font-semibold text-[#7d7d7d] text-left">Editing comment {inEditCommId}. <span className="text-purple-300 cursor-pointer" onClick={() => setInEditCommId(0)}>Cancel</span></p>
      ) : null}
      {comments != "Fetching" && postData != "Not found" && postData != "Error" ? (
        <textarea
          type="text"
          placeholder="Write a comment..."
          className="w-full h-8 bg-[#424242] text-[#ebebeb] text-sm font-semibold px-3.5 py-1.5 rounded-lg"
          value={commentInput}
          onChange={(e) => setCommentInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key == "Enter" && commentInput != "" && !isShift) {
              if (inEditCommId != 0) {
                editComment()
              } else {
                submitComment()
              }
            }
          }}
        />
      ) : null}
    </div>
  )
}