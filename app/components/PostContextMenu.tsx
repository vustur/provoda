'use client'

import { useEffect, useState } from "react"
import Image from "next/image"
import axios from "axios"

type Props = {
    show: boolean
    postid: string
    token: string
    mousePos : {x: number, y: number}
    authortag: string
    postcommun: string
}

export default function PostContextMenu({ show, postid, token, mousePos, authortag, postcommun }: Props) {
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

    useEffect(() => {
        fetchCommuns()
    }, [])

    const fetchCommuns = async () => {
        try {
          const fetch = await axios.post("/api/getUserCommuns", { token })
          const data = fetch.data
          console.log(data)

          if (data.includes(postcommun)) {
            setBtns([
              ...btns,
              {
                name: "Leave",
                icon: "minus",
                function: () => leaveCommun()
              }
            ])
          } else {
            setBtns([
              ...btns,
              {
                name: "Join",
                icon: "plus",
                function: () => joinCommun()
              }
            ])
          }
        } catch (err) {
          console.error(err) 
          console.error(err.response.data)
          if (err.response.data == "No communities") {
            setCommuns(["No communities"])
          }
        }
    }

    const joinCommun = async () => {
        try {
          const fetch = await axios.post("/api/joinCommunity", { token, commun: postcommun })
          const data = fetch.data
          console.log(data)
          fetchCommuns()
        } catch (err) {
          console.error(err.response.data)
        }
    }

    const leaveCommun = async () => {
        try {
          const fetch = await axios.post("/api/leaveCommunity", { token, commun: postcommun })
          const data = fetch.data
          console.log(data)
          fetchCommuns()
        } catch (err) {
          console.error(err.response.data)
        }
    }

    return (
        show && (
        <div className={`inline-flex flex-col absolute items-start justify-center bg-[#474747] p-2 rounded-lg shadow-lg z-20`}
        style={{top: `${mousePos.y}px`, left: `${mousePos.x}px`}}>
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
