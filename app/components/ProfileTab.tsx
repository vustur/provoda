import Image from "next/image"
import axios from "axios"
import { useEffect, useState, useContext } from "react"
import Button from "./IconButton"
import { mainContext } from "./PageBase"

type Props = {
  commun: any
}

export default function ProfileTab({ commun }: Props) {
  const [width, setWidth] = useState(1000)
  const [selfData, setSelfData] = useState(["Fetching"])
  const [selfRep, setSelfRep] = useState(["Fetching"])
  const [communData, setCommunData] = useState(["Fetching"])
  const [role, setRole] = useState("member")
  const [isShow, setIsShow] = useState(false)
  const { ctxVal, setCtxVal } = useContext(mainContext)
  let token = localStorage.getItem("token")

  useEffect(() => {
    setWidth(window.innerWidth)
    const onDeviceResize = () => {
      setWidth(window.innerWidth)
    }
    addEventListener("resize", onDeviceResize)

    if (commun == null) {
      fetchSelf()
    } else {
      fetchCommun()
    }
    setCtxVal(prevVal => ({
      ...prevVal,
      toggleProfile: (mode) => toggleProfile(mode),
      refreshAccount: () => fetchSelf()
    }))
  }, [])

  const toggleProfile = (mode) => {
    setIsShow(mode)
  }

  const fetchSelf = async () => {
    try {
      const fetch = await axios.post("/api/getAccount", { input: token })
      const data = fetch.data[0]
      setSelfData(data)
      console.log(data)
      await fetchSelfRep(data.tag)
    } catch (err) {
      console.error(err.response.data)
    }
  }

  const fetchSelfRep = async (tag) => {
    try {
      const fetch = await axios.post("/api/getAccountReput", { tag })
      let data = fetch.data
      setSelfRep(data)
      console.log(data)
    } catch (err) {
      console.error(err.response.data)
    }
  }

  const fetchCommun = async () => {
    try {
      const fetch = await axios.post("/api/getCommun", { token, commun })
      const data = fetch.data
      setCommunData(data)
      setRole(data.role)
      console.log(data)
    } catch (err) {
      console.error(err.response.data)
      setCommunData("Error")
    }
  }

  return (
    <div className={`items-center justify-start bg-gradient-to-b from-[#2a2a2a] to-[#303030] w-4/12 h-full px-4 shadow-2xl
        ${width <= 750 && !isShow ? "hidden" : ""} ${width <= 750 && isShow ? "absolute right-0 top-0 w-fit h-full" : ""} `}>
      {commun == null ? (
        <div className={`inline-flex flex-col items-center justify-start w-full h-full mt-8 px-4
        ${width <= 750 && isShow ? "mt-32" : ""}`}>
          <Image
            src={"/images/placeholder.jpg"}
            width={140}
            height={140}
            className="rounded-2xl"
            alt="placeholder"
          />
          <p className="text-xl my-2 font-semibold text-[#dbdbdb]">{selfData != "Fetching" ? selfData.nick : "Fetching..."}</p>
          <p className="text-sm -mt-3 font-semibold text-[#7f7f7f]">{selfData != "Fetching" ? "@" + selfData.tag : "Fetching..."}</p>
          <div className="bg-[#4e4e4e] border-1 w-[75%] h-[1px] my-2"></div>
          <div className="flex flex-col items-start justify-center relative space-y-2">
            <p className="w-full h-3 text-lg font-semibold text-[#d8d8d8] mb-1">{selfRep != "Fetching" ? selfRep.allRep.toString() + " rep" : "Fetching..."}</p>
            <p className="w-full h-2.5 text-sm font-semibold text-[#9f9f9f]">{selfRep != "Fetching" ? selfRep.postRep.toString() + " post rep" : "Fetching..."}</p>
            <p className="w-full h-2.5 text-sm font-semibold text-[#9f9f9f]">{selfRep != "Fetching" ? selfRep.commRep.toString() + " comment rep" : "Fetching..."}</p>
          </div>
          <div className="bg-[#4e4e4e] border-1 w-[75%] h-[1px] mb-2 mt-4"></div>
          <div className="inline-flex space-x-1 items-start justify-center relative w-[83px] h-[22px] py-1">
            <Button
              src="arrow_tr"
              onClick={() => window.location = "/u/" + selfData.tag}
            />
          </div>
        </div>
      ) : communData != "Error" ? (
        <div className="inline-flex flex-col items-center justify-start w-full h-full mt-8 px-4">
          <Image
            src={"/images/placeholder.jpg"}
            width={140}
            height={140}
            className="rounded-2xl"
            alt="placeholder"
          />
          <p className="text-xl my-2 font-semibold text-[#dbdbdb] truncate">{communData != "Fetching" ? "# " + communData.main.tag : "Fetching..."}</p>
          <div className="bg-[#4e4e4e] border-1 w-[75%] h-[1px] mb-1 mt-1"></div>
          <p className="text-lg mt-1 font-semibold text-[#b9b9b9] text-left">{communData != "Fetching" ? communData.mems + " members" : "Fetching..."}</p>
          <p className="text-lg mb-1 font-semibold text-[#b99ce1] text-left">{role != "member" && role != "none" ? role : null}</p>
          <div className="bg-[#4e4e4e] border-1 w-[75%] h-[1px] mb-1 mt-1"></div>
          <div className="inline-flex space-x-1 items-start justify-center relative w-[83px] h-[22px] py-1">
            {role == "owner" || role == "mod" ? (
              <Button src="gear"
                onClick={() => ctxVal.openCommunSettings()} />
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}