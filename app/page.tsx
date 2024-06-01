'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
const Cookie = require('js-cookie')
import CommunityButton from "./components/CommunityButton";
import Post from            "./components/Post";
import Button from          "./components/Button";
import { title } from "process";

export default function Home() {
  const [width, setWidth] = useState(1000)
  const [token, setToken] = useState(Cookie.get("token"))
  const [posts, setPosts] = useState(["Fetching"])
  const [selfData, setSelfData] = useState(["Fetching"])
  const [selfRep, setSelfRep] = useState(["Fetching"])
  const [communs, setCommuns] = useState(["Fetching"])

  useEffect(() => {
    if (token == null) {
      window.location.href = '/login'
      return
    }

    setWidth(window.innerWidth)
    const onDeviceResize = () => {
      setWidth(window.innerWidth)
    }
    addEventListener("resize", onDeviceResize)

    console.log("Token = " + token)
    fetchPosts()
    fetchSelf()
    fetchCommuns()
  }, [])

  const warn = (err) => {
    console.error(err)
    // alert(err)
  }

  const fetchPosts = async () => {
    try {
      const fetch = await axios.post("/api/loadFeed", { token })
      const data = fetch.data
      setPosts(data)
      console.log(data)
    } catch (err) {
      expectError(err)
      if (err.response.data == "No communities") {
        setPosts(["No communities"])
      }
    }
  }

  const fetchSelf = async () => {
    try {
      const fetch = await axios.post("/api/getAccount", { input: token })
      const data = fetch.data[0]
      setSelfData(data)
      console.log(data)
      await fetchSelfRep(data.tag)
    } catch (err) {
      expectError(err)
    }
  }

  const fetchSelfRep = async (tag) => {
    try {
      const fetch = await axios.post("/api/getAccountReput", { tag })
      let data = fetch.data
      setSelfRep(data)
      console.log(data)
    } catch (err) {
      expectError(err)
    }
  }

  const fetchCommuns = async () => {
    try {
      const fetch = await axios.post("/api/getUserCommuns", { token })
      const data = fetch.data
      setCommuns(data)
      console.log(data)
    } catch (err) {
      expectError(err)
    }
  }

  const expectError = (err) => {
    if (!err.response) {
      warn(err)
      return
    }
    warn("[API Error] " + err.response.data)
    switch (err.response.data) {
      case "Acc not found":
        Cookie.remove("token")
        setToken(null)
        window.location.href = '/login'
        break

      default:
        break
    }
  }

  return (
<div className="absolute bg-[#2a2a2a] w-full h-full flex flex-col">
  {/* Load Screen */}
  <div className={`absolute bg-[#343434] w-full h-full flex flex-col items-center justify-center z-50 transition duration-300 ease-in-out
  ${posts == "Fetching" && selfData == "Fetching" && selfRep == "Fetching" ? "opacity-80" : "opacity-0 hidden"}`}>
    <p className="text-xl font-semibold text-[#cecece]">Loading...</p>
  </div>
  {/* Top */}
  <div className="inline-flex items-center justify-start w-full h-14">
          {width > 300 ? (
          <div className="w-4/12">
            <p className="w-fit ml-3 font-semibold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-[#e0e0e0] to-[#9354B1]">Provoda</p>
          </div>
          ) : null}
          {width > 570 ? (
          <div className="relative bg-[#3a3a3a] w-5/12 h-8 rounded-lg">
              <p className="w-max h-3 absolute left-2 top-1 text-md text-[#575757]">Type to search on Provoda...</p>
          </div>
          ) : null }
          {/* Btns */}
          <div className={`relative h-full px-2.5 flex items-center
         ${width <= 570 ? "w-full" : "w-4/12"} ${width <= 300 ? "mx-auto flex justify-center" : "flex-row-reverse"} `}>
           <div className={`p-1 h-fit flex space-x-2.5 items-center justify-center ${width <= 300 ? "mx-auto" : ""} bg-[#3c3c3c] rounded-md`}>
              {width < 750 ? (
              <Button
                src="user"
              />
              ) : null }
              {width < 570 ? (
              <Button
                src="search"
              />
              ) : null }
              <Button src="pen" isSpecial={true}/>
              <Button src="bell"/>
              <Button src="gear"/>
          </div>
        </div>
      </div>
    {/* Main part of page */}
    <div className="bg-white bg-opacity-0 w-full h-full flex flex-row">
      {/* Communities */}
      {width > 570 ? (
        <div className="inline-flex flex-col items-start justify-start bg-[#2d2d2d] w-4/12 h-full px-[17px]">
            <div className="relative w-[116px] h-3">
            </div>
            <div className="flex flex-col items-start justify-start relative py-[5px]">
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
        </div>
        ) : null}
        {/* Posts */}
        <div className="inline-flex flex-col space-y-3 items-center justify-start bg-[#363636] w-full h-full px-[15px] pt-2.5 rounded-tr-xl">
          {
            posts[0] == "Fetching" ? (
              <div className="flex flex-col items-center justify-center h-full">
                <p className="text-xl font-semibold text-[#545454] text-center">Fetching posts...</p>
              </div>
            ) : posts[0] == "No communities" ? (
              <div className="flex flex-col items-center justify-center h-full">
                <Image
                src={"/images/wluffy_head_light.png"}
                width={150}
                height={150}
                className="rounded-2xl mb-2 grayscale-1 brightness-50 opacity-40"
                />
                <p className="text-xl font-semibold text-[#545454] text-center">No communities or posts in your communities yet...<br></br>Join some to load feed!</p>
              </div>
            ) : posts.length > 0 && posts[0] != "No communities" && posts[0] != "Fetching" ? (
              posts.map((post) => (
                <Post
                  key={post.id}
                  title={JSON.parse(post.content)['title']}
                  author={post.authortag}
                  date={new Date(post.date).toLocaleString('ru-RU', { year: '2-digit', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(':00 ', ' ')}
                  textContent={JSON.parse(post.content)['text']}
                  reputation={post.reputation}
                  community={post.commun}
                  token={token}
                  postid={post.id}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <Image
                  src={"/images/wluffy_head_light.png"}
                  width={150}
                  height={150}
                  className="rounded-2xl mb-2 grayscale-1 brightness-50 opacity-40"
                />
                <p className="text-xl font-semibold text-[#545454] text-center">Smth went wrong...<br></br>Open console to see</p>
            </div>
            )
          }
        </div>
        {/* Profile */}
        {width > 750 ? (
        <div className="inline-flex flex-col items-center justify-start bg-gradient-to-b from-[#2a2a2a] to-[#303030] w-4/12 h-full mt-8 px-4 shadow-2xl">
            <Image
            src={"/images/placeholder.jpg"}
            width={140}
            height={140}
            className="rounded-2xl"
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
              <Button src="arrow_tr"/>
            </div>
        </div>) : null}
    </div>
</div>
  );
}
