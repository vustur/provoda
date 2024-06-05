'use client'
import { useEffect, useState } from "react"
import axios from "axios"
import ProfileTab from "@/app/components/ProfileTab"
import CommunityTab from "@/app/components/CommunityTab"
import OpenedPostTab from "@/app/components/OpenedPostTab"
import Top from "@/app/components/Top"

export default function main({ params }: { params: { slug: string } }){
    const [postData, setPostData] = useState(['Fetching'])

    useEffect(() => {
        fetchPost(params.slug)
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

    return (
        <div className="absolute bg-[#2a2a2a] w-full h-full flex flex-col">
        <Top />
          {/* Main part of page */}
          <div className="w-full h-full flex flex-row">
              <CommunityTab />
              <OpenedPostTab id={params.slug} />
              { postData[0] != "Fetching" ?
              <ProfileTab commun={postData.commun} />
              : null }
          </div>
      </div>
    )
}