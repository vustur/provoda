import React, { useState, useEffect, useContext } from "react"
import Button from "./IconButton"
import WriteModal from "./WriteModal"
import AccountSettingsModal from "./AccountSettingsModal"
import SearchMenu from "./SearchMenu"
import { mainContext } from "./PageBase"
import axios from "axios"

export default function Top() {
  const [width, setWidth] = useState(1000)
  const [isProfileShow, setIsProfileShow] = useState(false)
  const [searchText, setSearchText] = useState("")
  const { ctxVal, setCtxVal } = useContext(mainContext)
  let token = localStorage.getItem("token")

  useEffect(() => {
    setWidth(window.innerWidth)
    const onDeviceResize = () => {
      setWidth(window.innerWidth)
    }
    addEventListener("resize", onDeviceResize)
    checkIfExists()
  }, [])

  const checkIfExists = async () => {
    try {
      const req = await axios.post("/api/getAccount", { "input": token })
      const data = req.data
      console.log(data)
      sessionStorage.setItem("tag", data[0].tag)
    }
    catch (err) {
      console.error(err.response.data)
      console.log("Looks like token is invalid, going to login page")
      console.log(localStorage)
      window.location = "/login"
    }
  }

  return (
    <div className="inline-flex items-center justify-start w-full z-30">
      {width > 300 ? (
        <div className="w-4/12">
          <p className="w-fit ml-3 cursor-pointer font-semibold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-[#e0e0e0] to-[#9354B1]"
            onClick={() => window.location = "/"}
          >Provoda</p>
        </div>
      ) : null}
      {width > 570 ? (
        <input
          className="w-5/12 h-8 px-2 bg-[#3a3a3a] text-[#c2c2c2] rounded-lg z-20"
          placeholder="Type to search on Provoda..."
          onChange={(e) => {
            setSearchText(e.target.value)
          }}
          onKeyDown={(e) => {
            if (e.key == "Enter" && searchText != "") {
              e.preventDefault()
              ctxVal.search(searchText)
            }
          }}
          value={searchText}
        />
      ) : null}
      {/* Btns */}
      <div className={`relative h-12 px-2.5 flex items-center
       ${width <= 570 ? "w-full" : "w-4/12"} ${width <= 300 ? "mx-auto flex justify-center" : "flex-row-reverse"} `}>
        <div className={`p-1 h-fit flex space-x-2.5 items-center justify-center ${width <= 300 ? "mx-auto" : ""} bg-[#3c3c3c] rounded-md`}>
          {width <= 300 ? (
            <Button
              src="house"
              onClick={() => window.location = "/"}
            />
          ) : null}
          {width <= 750 ? (
            <Button
              src="user"
              onClick={() => {
                ctxVal.toggleProfile(!isProfileShow)
                setIsProfileShow(!isProfileShow)
              }}
            />
          ) : null}
          {width <= 570 ? (
            <Button
              src="search"
            />
          ) : null}
          <Button src="pen"
            isSpecial={true}
            onClick={() => ctxVal.openWriteFunc("write")}
          />
          <Button src="bell" />
          <Button src="gear"
          onClick={() => ctxVal.openAccountSettings()}/>
        </div>
      </div>
      <WriteModal />
      <AccountSettingsModal />
      <SearchMenu isOpen={searchText.length > 0} />
    </div>
  )
}