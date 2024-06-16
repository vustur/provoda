'use client'
import { useEffect, useState, useContext } from "react"
import { mainContext } from "./PageBase"
import Image from "next/image"
import axios from "axios"

type Props = {
  show: boolean
  commid: string
  token: string
  mousePos: { x: number, y: number }
  authortag: string
  postcommun: string
  content: string
  isreply: boolean
}

export default function PostContextMenu({ show, commid, token, mousePos, authortag, postcommun, content, isreply }: Props) {
  const [btns, setBtns] = useState([
    {
      name: "Share",
      icon: "share",
      function: () => navigator.clipboard.writeText(window.location.origin + "/p/" + postid)
    },
    {
      name: "Report",
      icon: "flag",
      function: () => alert("Reports will be added later :/")
    },
  ])
  const { ctxVal, setCtxVal } = useContext(mainContext)

  useEffect(() => {
    addSpecBtns()

    if (btns.find((btn) => btn.name == "Reply")) return
    if (!isreply){
      setBtns([
        ...btns,
        {
          name: "Reply",
          icon: "halfarrow",
          function: () => {
            if (ctxVal.commReplyTo != null) {
              ctxVal.commReplyTo(commid)
            } else {
              alert("Comment cannot be replied at this page. Go to post page to edit it")
            }
          }
        },
      ])
    }
  }, [show])

  const addSpecBtns = async () => {
    if (show != true) return
    if (btns.find((btn) => btn.name == "Delete")) return
    let role = "member"
    const check = () => {
      if (authortag == sessionStorage.getItem("tag")) {
        setBtns([
          ...btns,
          {
            name: "Delete",
            icon: "trash",
            function: () => deleteComment()
          },
          {
            name: "Edit",
            icon: "pentwo",
            function: () => {
              if (ctxVal.editComment != null) {
                ctxVal.editComment(content, commid)
              } else {
                alert("Comment cannot be edited at this page. Go to post page to edit it")
              }
            }
          }
        ])
      } else if (role == "owner" || role == "mod") {
        setBtns([
          ...btns,
          {
            name: "Delete",
            icon: "trash",
            function: () => deleteComment()
          }
        ])
      }
    }

    role = await getRole()
    check()
  }

  const deleteComment = async () => {
    try {
      const fetch = await axios.post("/api/deleteComm", { token, commid })
      const data = fetch.data
      console.log(data)
      ctxVal.refresh()
    } catch (err) {
      console.error(err.response.data)
    }
  }

  const getRole = async () => {
    try {
      const fetch = await axios.post("/api/getRoleByComment", { commid, token })
      const data = fetch.data
      console.log(data)
      return data
    } catch (err) {
      console.error(err.response.data)
    }
  }

  return (
    show && (
      <div className={`inline-flex flex-col absolute items-start justify-center bg-[#474747] p-2 rounded-lg shadow-lg z-20`}
        style={{ top: `${mousePos.y}px`, left: `${mousePos.x}px` }}>
        {
          btns.map((btn) => (
            <button className="text-lg flex mb-1 p-1 w-full rounded-lg text-[#c1c1c1] hover:text-purple-300 hover:bg-[#3d3d3d] transition ease-in-out duration-300 truncate"
              onClick={() => btn.function()}
              key={btn.name}>
              <Image
                width={25}
                height={25}
                src={"/icons/" + btn.icon + ".svg"}
                className="opacity-80 mr-2"
                alt="Icon"
              />
              <p>{btn.name}</p>
            </button>
          ))
        }
      </div>
    )
  )
}
