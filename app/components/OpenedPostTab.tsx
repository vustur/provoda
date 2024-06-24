import Post from "./Post";
import Comment from "./Comment";
import { useEffect, useState, useContext } from "react";
import { mainContext } from "./PageBase"
import axios from "axios";
import WluffyError from "./WluffyError";
import Image from "next/image";
import Button from "./IconButton";

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
  const [replyCommId, setReplyCommId] = useState(0)
  const { ctxVal, setCtxVal } = useContext(mainContext)
  let token = typeof window !== "undefined" ? window.localStorage.getItem('token') : null

  useEffect(() => {
    setWidth(window.innerWidth)
    const onDeviceResize = () => {
      setWidth(window.innerWidth)
    }
    addEventListener("resize", onDeviceResize)
    window.addEventListener("keydown", (e) => {
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
    setCtxVal(prevVal => ({
      ...prevVal,
      refreshPosts: () => refresh(),
      refresh: () => fetchComments(id),
      editComment: (content, commid) => {
        setCommentInput(content)
        setReplyCommId(0)
        setInEditCommId(commid)
      },
      commReplyTo: (commid) => {
        setInEditCommId(0)
        setReplyCommId(commid)
      }
    }))
  }, [])

  const refresh = () => {
    fetchPost(id)
    fetchComments(id)
    setInEditCommId(0)
    setReplyCommId(0)
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
      const fetch = await axios.post("/api/createComm", { postid: id, text: commentInput, token, replyid: replyCommId })
      const data = fetch.data
      console.log(data)
      refresh()
    } catch (err) {
      console.error(err.response.data)
      alert(err.response.data)
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
      alert(err.response.data)
    }
  }

  const onKeyDownInCommWrite = (e) => {
    console.log(isShift)
    if (e.key == "Enter" && commentInput != "" && !isShift) {
      e.preventDefault()
      if (inEditCommId != 0) {
        editComment()
      } else {
        submitComment()
      }
    }
  }

  return (
    <div className="h-full w-full bg-[#363636]">
      <div className="inline-flex flex-col space-y-3 items-center justify-start w-full h-[90vh] px-[15px] pt-3 rounded-tr-xl mb-4"
        style={{ overflowY: "scroll" }}>
        <div className="inline-flex flex-col items-start justify-start w-full h-max overflow-scroll">
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
              attach={postData.content.attach}
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
          {comments != "Fetching" &&
            <Button
              src="refresh"
              onClick={() => refresh()}
              isSpecial={true}
              text="Refresh (temp broken)"
              className="mb-2 bg-opacity-70"
              isDisabled={true}
            />
          }
          {comments != "Fetching" && comments != "None" && comments != "Post not found" && postData != "Not found" && postData != "Error" ? (
            comments.map((comment) => (
              comment.replyto == 0 ? (
              <Comment
                key={comment.id}
                authortag={comment.authortag}
                textContent={comment.content}
                date={comment.date}
                postid={comment.postid}
                reputation={comment.reputation}
                commid={comment.id}
                replyto={0}
                allComs={comments}
              />
              ) : null
            ))
          ) : comments == "Fetching" ? (
            <p className="text-xl font-semibold text-[#545454] text-center">Fetching comments...</p>
          ) : comments == "None" ? (
            <WluffyError
              image="wluffy_with_box_light.png"
              textOne="No comments"
              textTwo="Be the first to comment!"
            />
          ) : null
          }
        </div>
        {inEditCommId != 0 ? (
          <p className="text-sm w-full font-semibold text-[#7d7d7d] text-left">Editing comment {inEditCommId}. <span className="text-purple-300 cursor-pointer" onClick={() => setInEditCommId(0)}>Cancel</span></p>
        ) : replyCommId != 0 ? (
          <p className="text-sm w-full font-semibold text-[#7d7d7d] text-left">Replying to {replyCommId}. <span className="text-purple-300 cursor-pointer" onClick={() => setReplyCommId(0)}>Cancel</span></p>
        ) : null}
        {comments != "Fetching" && postData != "Not found" && postData != "Error" ? (
          <textarea
            type="text"
            placeholder="Write a comment..."
            className="w-full h-16 bg-[#424242] text-[#ebebeb] text-sm font-semibold px-3.5 py-1.5 rounded-lg"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={(e) => {
              onKeyDownInCommWrite(e)
            }}
          />
        ) : null}
      </div>
    </div>
  )
}