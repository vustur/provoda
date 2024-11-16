import Post from "./Post";
import { useEffect, useState, useContext } from "react";
import { mainContext } from "./PageBase"
import axios from "axios";
import Image from "next/image";
import Button from "./IconButton";
import CommunitySettings from "./CommunitySettingsModal"
import WluffyError from "./WluffyError";
import Avatar from "./Avatar"
import Cookies from "js-cookie"

type Props = {
  commun: String
}

export default function PostsTab({ commun }: Props) {
  const [width, setWidth] = useState(1000)
  const [posts, setPosts] = useState(["Fetching"])
  const [communData, setCommunData] = useState(["Fetching"])
  const [communs, setCommuns] = useState([])
  const [offset, setOffset] = useState(10)
  const [isMorePostFetching, setIsMorePostFetching] = useState(false)
  const { ctxVal, setCtxVal } = useContext(mainContext)
  let token = Cookies.get("token") || null

  useEffect(() => {
    setWidth(window.innerWidth)
    const onDeviceResize = () => {
      setWidth(window.innerWidth)
    }
    addEventListener("resize", onDeviceResize)
    refresh()
    setCtxVal(prevVal => ({ ...prevVal, refreshPosts: () => refresh() }))
  }, [])

  const refresh = () => {
    if (commun != null) {
      fetchPostsByCommun(commun)
      fetchCommun()
      fetchCommuns()
    } else {
      fetchFeed()
    }
  }

  const fetchFeed = async () => {
    if (!token) {
      setPosts(["NoToken"])
      return
    }
    try {
      const fetch = await axios.post("/api/loadFeed", { token })
      const data = fetch.data
      setPosts(data)
      console.log(data)
    } catch (err) {
      console.error(err.response.data)
      if (err.response.data == "No communities") {
        setPosts(["No communities"])
      }
    }
  }

  const extendFeed = async () => {
    setIsMorePostFetching(true)
    try {
      const fetch = await axios.post("/api/loadFeed", { token, offset })
      const data = fetch.data
      setPosts(prevPosts => [...prevPosts, ...data])
      setOffset(offset + 10)
      console.log(data)
      setIsMorePostFetching(false)
    } catch (err) {
      console.error(err.response.data)
      if (err.response.data != "No communities") {
        setIsMorePostFetching(false)
      }
    }
  }

  const fetchPostsByCommun = async (commun) => {
    try {
      const fetch = await axios.post("/api/loadCommunityPosts", { token, commun })
      const data = fetch.data
      setPosts(data)
    } catch (err) {
      console.error(err.response.data)
      if (err.response.data == "No posts") {
        setPosts(["No posts"])
      }
      if (err.response.data == "Community not found") {
        setPosts(["Community not found"])
      }
    }
  }

  const extendPostsByCommun = async (commun) => {
    setIsMorePostFetching(true)
    try {
      const fetch = await axios.post("/api/loadCommunityPosts", { token, commun, offset })
      const data = fetch.data
      setOffset(offset + 10)
      setPosts(prevPosts => [...prevPosts, ...data])
    } catch (err) {
      console.error(err.response.data)
      if (err.response.data != "No posts") {
        setIsMorePostFetching(false)
      }
    }
  }

  const fetchCommun = async () => {
    try {
      const fetch = await axios.post("/api/getCommun", { token, commun })
      const data = fetch.data
      setCommunData(data)
      console.log(data)
    } catch (err) {
      console.error(err.response.data)
    }
  }

  const fetchCommuns = async () => {
    if (!token){
      return
    }
    try {
      const fetch = await axios.post("/api/getUserCommuns", { token })
      const data = fetch.data
      setCommuns(data)
      console.log(data)
    } catch (err) {
      console.error(err.response.data)
    }
  }

  const joinCommun = async () => {
    try {
      const fetch = await axios.post("/api/joinCommunity", { token, commun })
      const data = fetch.data
      console.log(data)
      fetchCommuns()
    } catch (err) {
      console.error(err.response.data)
    }
  }

  const leaveCommun = async () => {
    try {
      const fetch = await axios.post("/api/leaveCommunity", { token, commun })
      const data = fetch.data
      console.log(data)
      fetchCommuns()
    } catch (err) {
      console.error(err.response.data)
    }
  }

  return (
    <div className="inline-flex flex-col space-y-3 items-center justify-start bg-[#363636] w-full h-[100%] px-[15px] pt-3 rounded-tr-xl"
      style={{ overflowY: "scroll" }}>
      {commun != null && communData[0] != "Fetching" ? (
        <div className="inline-flex flex-row items-center justify-between bg-[#2d2d2d] w-full rounded-t-xl p-3">
          <div className="flex flex-row items-center">
            <Avatar
              src={communData && communData.main.pfp && communData.main.pfp}
              size={5}
              pixels={80}
            />
            <div className="inline-flex flex-col items-start justify-start w-fit">
              <p className="text-2xl font-semibold text-[#f1f1f1] truncate"># {communData.main.tag}</p>
              <p className="text-lg  font-semibold text-[#bababa] truncate">{communData.mems + " members"}</p>
            </div>
          </div>
          <div className="flex flex-row gap-2 mr-5">
            {!communs.includes(commun) ? (
              <button className="text-lg text-[#f1f1f1] bg-purple-400 p-2 hover:bg-purple-500 bg-opacity-70 hover:bg-opacity-50 rounded-xl font-semibold transition ease-in-out duration-300"
                onClick={() => joinCommun()}>Join</button>
            ) : communs.includes(commun) ? (
              <button className="text-lg text-[#f1f1f1] bg-purple-400 p-2 hover:bg-purple-500 bg-opacity-70 hover:bg-opacity-50 rounded-xl font-semibold transition ease-in-out duration-300"
                onClick={() => leaveCommun()}>Leave</button>
            ) : null}
            {communData.role == "owner" || communData.role == "mod" ? (
              <Button src="gear"
                onClick={() => ctxVal.openCommunSettings(commun, communData.role)} />
            ) : null}
          </div>
        </div>
      ) : null
      }
      {
        posts[0] == "Fetching" ? (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-xl font-semibold text-[#545454] text-center">Fetching posts...</p>
          </div>
        ) : posts[0] == "No communities" ? (
          <WluffyError
            image={"wluffy_wires_light.png"}
            textOne={
              "No communities or no posts in your communities yet..."
            }
            textTwo={
              "Join some to load feed!"
            }
          />
        ) : posts[0] == "No posts" ? (
          <WluffyError
            image={"wluffy_with_box_light.png"}
            textOne={
              "No posts in this community yet..."
            }
            textTwo={
              "Posts something first!"
            }
          />
        ) : posts[0] == "Community not found" ? (
          <WluffyError
            image={"wluffy_wires_light.png"}
            textOne={
              "Community not found"
            }
          />
        ) : posts[0] == "NoToken" ? (
          <WluffyError
            image={"wluffy_helmet_light.png"}
            textOne={
              "Feed cannot be loaded without login"
            }
            textTwo={
              "Try searching for posts or communities!"
            }
            buttonText="Login"
            buttonFunc={() => window.location = "/login"}
          />
        ) : posts.length > 0 && typeof posts[0] == 'object' ? (
          <div className="w-full">
            <Button
              src="refresh"
              onClick={() => refresh()}
              isSpecial={true}
              text="Refresh"
              className="mb-2 bg-opacity-70"
            />
            {posts.map((post) => (
              <Post
                key={post.id}
                title={post.content.title}
                author={post.authortag}
                date={post.date}
                textContent={post.content.text}
                reputation={post.reputation}
                community={post.commun}
                token={token}
                postid={post.id}
                isOpen={false}
                attach={post.content.attach}
                ownStatus={post.ownStatus}
              />
            ))}
            <Button
              src="refresh"
              onClick={commun ? () => extendPostsByCommun(commun) : () => extendFeed()}
              isSpecial={true}
              text="Load more"
              isDisabled={isMorePostFetching}
              className="mb-2 bg-opacity-70"
            />
          </div>
        ) : (
          <WluffyError
          image={"wluffy_helmet_light.png"}
          textOne={
            "Something unknown and unexpected went wrong"
          }
          textTwo={
            `Try reloading page or reporting error to devs`
          }
        />
        )
      }
      {commun != null && communData[0] != "Fetching" &&
        <CommunitySettings
          commun={commun}
        />
      }
    </div>
  )
}