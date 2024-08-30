import Image from "next/image"
import axios from "axios"
import { useEffect, useState, useContext } from "react"
import CommunityButton from "./CommunityButton"
import CommunityCreateModal from "./CommunityCreateModal"
import Button from "./IconButton"
import { mainContext } from "./PageBase"

export default function CommunityTab() {
  const [width, setWidth] = useState(1000)
  const [communs, setCommuns] = useState(["Fetching"])
  const [isShow, setIsShow] = useState(false)
  const { ctxVal, setCtxVal } = useContext(mainContext)
  let token = typeof window !== "undefined" ? (window.localStorage.getItem("token") != null ? window.localStorage.getItem('token') : null) : null

  useEffect(() => {
    setWidth(window.innerWidth)
    const onDeviceResize = () => {
      setWidth(window.innerWidth)
    }
    addEventListener("resize", onDeviceResize)
    fetchCommuns()
    setCtxVal(prevVal => ({
      ...prevVal,
      refreshCommuns: () => fetchCommuns(),
      toggleCommuns: (mode) => toggleCommuns(mode)
    }))
  }, [])

  const toggleCommuns = (mode) => {
    setIsShow(mode)
    setCtxVal(prevVal => ({
      ...prevVal,
      isCommunsOpen: mode
    }))
    // if (mode){
    //   ctxVal.toggleProfile(false)
    // }
  }

  const fetchCommuns = async () => {
    if (!token) {
      setCommuns(["NoToken"])
      return
    }
    try {
      const fetch = await axios.post("/api/getUserCommuns", { token })
      const data = fetch.data
      setCommuns(data)
      console.log(data)
    } catch (err) {
      console.error(err.response.data)
      if (err.response.data == "No communities") {
        setCommuns(["No communities"])
      }
    }
  }

  return (
    <div className={`inline-flex flex-col items-start justify-start bg-[#2d2d2d] w-4/12 h-full px-[17px] overflow-y-auto z-20
            ${width <= 570 && !isShow && "hidden"} ${width <= 570 && isShow && "absolute left-0 w-fit h-full"} ${width < 500 && isShow ? "top-0" : width >= 500 ? "top-8" : ""}`}>
      <div className="relative w-[116px] h-3">
      </div>
      <div className="flex flex-col items-start justify-start relative py-[5px]">
        {communs[0] != "Fetching" && token ? (
          <Button
            src="plus"
            onClick={() => ctxVal.openCommunCreate()}
            text="Create"
            isSpecial={true}
            className="mb-2"
          />
        ) : null}
        <p className="text-xl font-semibold text-[#d9d9d9]">Joined</p>
        <div className="flex flex-col items-start justify-center relative py-0.5">
          {communs[0] == "Fetching" ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-xl font-semibold text-[#545454] text-center">Fetching joined communities...</p>
            </div>
          ) : communs[0] == "No communities" ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-xl font-semibold text-[#545454] text-center">No communities</p>
            </div>
          ) : communs[0] == "NoToken" ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-xl font-semibold text-[#545454] text-center">Login to view communities</p>
            </div>
          ) : (
            communs.map((community) => {
              return (
                <CommunityButton
                  key={community}
                  name={community}
                />
              )
            }))}
        </div>
      </div>
      <CommunityCreateModal />
    </div>
  )
}