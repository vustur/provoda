'use client'
import Image from "next/image";
import { useEffect, useState } from "react";
import CommunityButton from "./components/CommunityButton";
import Post from            "./components/Post";
import Button from          "./components/Button";

export default function Home() {
  const [width, setWidth] = useState(window.innerWidth)

  useEffect(() => {
  const onDeviceResize = () => {
    setWidth(window.innerWidth)
  }
  addEventListener("resize", onDeviceResize)
  })

  return (
<div className="absolute bg-[#2a2a2a] w-full h-full flex flex-col">
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
            <div className="flex flex-col items-start justify-start relativ py-[5px]">
                <p className="text-xl font-semibold text-[#d9d9d9]">Favorite</p>
                <div className="flex flex-col items-start justify-center relative  py-0.5">
                    <CommunityButton name="something" ></CommunityButton>
                    <CommunityButton name="geography"></CommunityButton>
                    <CommunityButton name="bikes"></CommunityButton>
                </div>
            </div>
            <div className="flex flex-col items-start justify-start relative py-[5px]">
                <p className="text-xl font-semibold text-[#d9d9d9]">Recent</p>
                <div className="flex flex-col items-start justify-center relative  py-0.5">
                    <CommunityButton name="something" ></CommunityButton>
                    <CommunityButton name="geography"></CommunityButton>
                    <CommunityButton name="bikes"></CommunityButton>
                </div>
            </div>
            <div className="flex flex-col items-start justify-start relative py-[5px]">
                <p className="text-xl font-semibold text-[#d9d9d9]">Joined</p>
                <div className="flex flex-col items-start justify-center relative py-0.5">
                    <CommunityButton name="something" ></CommunityButton>
                    <CommunityButton name="geography"></CommunityButton>
                    <CommunityButton name="bikes"></CommunityButton>
                </div>
            </div>
        </div>
        ) : null}
        {/* Posts */}
        <div className="inline-flex flex-col space-y-3 items-center justify-start bg-[#363636] w-full h-full px-[15px] pt-2.5 rounded-tr-xl">
            <Post
            title={"Kafif joke"}
            author={"floatingFrog"}
            community={"stupid"}
            textContent={"kafif perfectionist kafif into a kafif apparently, kafif kafif was not set kafif enough."}
            rating={0}
            date={"1 minute ago"}
            ></Post>
        </div>
        {/* Profile */}
        {width > 750 ? (
        <div className="inline-flex flex-col items-center justify-start bg-gradient-to-b from-[#2a2a2a] to-[#303030] w-4/12 h-full mt-8 px-4">
            <Image
            src={"/images/placeholder.jpg"}
            width={140}
            height={140}
            className="rounded-2xl"
            />
            <p className="text-xl my-2 font-semibold text-[#dbdbdb]">@tastyMeatball76</p>
            <div className="bg-[#4e4e4e] border-1 w-[75%] h-[1px] my-2"></div>
            <div className="flex flex-col items-start justify-center relative space-y-2">
                <p className="w-full h-3 text-lg font-semibold text-[#d8d8d8] mb-1">500 karma</p>
                <p className="w-full h-2.5 text-sm font-semibold text-[#9f9f9f]">402 post karma</p>
                <p className="w-full h-2.5 text-sm font-semibold text-[#9f9f9f]">98 comment karma</p>
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
