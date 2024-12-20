import React, { useState, useEffect, useContext } from "react"
import Button from "./IconButton"
import WriteModal from "./WriteModal"
import AccountSettingsModal from "./AccountSettingsModal"
import SearchMenu from "./SearchMenu"
import PictureModal from "./PictureViewModal"
import { mainContext } from "./PageBase"
import axios from "axios"
import Cookies from "js-cookie"

export default function Top() {
  const [width, setWidth] = useState(1000)
  const [searchText, setSearchText] = useState("")
  const [isMobileSearch, setIsMobileSearch] = useState(false)
  const { ctxVal, setCtxVal } = useContext(mainContext)
  const [isAnon, setIsAnon] = useState(false)
  let token = Cookies.get("token") || null

  useEffect(() => {
    if (!token){
      setIsAnon(true)
    }
    setWidth(window.innerWidth)
    const onDeviceResize = () => {
      setWidth(window.innerWidth)
    }
    addEventListener("resize", onDeviceResize)
    checkIfExists()
  }, [])

  const checkIfExists = async () => {
    try {
      if (!token) {
        throw new Error("No token")
      }
      const req = await axios.post("/api/getAccount", { "input": token })
      const data = req.data
      console.log(data)
      sessionStorage.setItem("tag", data[0].tag)
    }
    catch (err) {
      console.error(err)
      console.log("Looks like token is invalid OR not found. NoReg mode")
      sessionStorage.setItem("tag", "anon")
    }
  }

  return (
    <div className="inline-flex items-center justify-start w-full z-30 bg-[#2b2b2b]">
      {width > 400 ? (
        <div className="w-4/12">
          <p className="w-fit ml-3 cursor-pointer font-semibold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-[#e0e0e0] to-[#9354B1]"
            onClick={() => window.location = "/"}
          >Provoda</p>
        </div>
      ) : null}
      {width > 570 || isMobileSearch ? (
        <input
          className={`${isMobileSearch && width <= 570 ? "w-full ml-1" : "w-5/12"} h-8 px-2 bg-[#3a3a3a] text-[#c2c2c2] rounded-lg z-20`}
          placeholder="Type and press enter to search on Provoda..."
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
       ${width <= 570 && !isMobileSearch ? "w-full" : "w-4/12"} ${width <= 300 ? "mx-auto flex justify-center" : "flex-row-reverse"} `}>
        {!isMobileSearch ? (
          <div className={`p-1 h-fit flex space-x-2.5 items-center justify-center ${width <= 400 ? "mx-auto" : ""} bg-[#3c3c3c] rounded-md`}>
            {width <= 400 && (
              <Button
                src="halfarrow"
                onClick={() => window.location = "/"}
              />
            )}
            {width <= 570 && (
              <Button
                src="house"
                onClick={() => {
                  ctxVal.toggleCommuns(!ctxVal.isCommunsOpen)
                  setCtxVal(prevVal => ({
                    ...prevVal,
                    isCommunsOpen: !ctxVal.isCommunsOpen
                  }))
                }}
              />
            )}
            {width <= 750 || isAnon ? (
              <Button
                src="user"
                onClick={() => {
                  if (token) {
                    ctxVal.toggleProfile(!ctxVal.isProfileOpen)
                    setCtxVal(prevVal => ({
                      ...prevVal,
                      isProfileOpen: !ctxVal.isProfileOpen
                    }))
                  } else {
                    window.location = "/login"
                  }
                }}
              />
            ) : null}
            {!isAnon && (
              <Button src="pen"
                isSpecial={true}
                onClick={() => ctxVal.openWriteFunc("write")}
              />
            )}
            {width <= 570 && (
              <Button src="search"
                onClick={() => setIsMobileSearch(true)}
              />
            )}
            {!isAnon && (
              <Button src="bell"
                onClick={() => alert("Notifications will be added later :/")}
              />
            )}
            {!isAnon && (
              <Button src="gear"
                onClick={() => ctxVal.openAccountSettings()} />
            )}
          </div>
        ) : (
          <Button src="halfarrow"
            onClick={() => setIsMobileSearch(false)} />
        )}
      </div>
      <WriteModal />
      <AccountSettingsModal />
      <SearchMenu isOpen={searchText.length > 0} />
      <PictureModal />
    </div>
  )
}