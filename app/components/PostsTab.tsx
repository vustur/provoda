const Cookie = require('js-cookie')
import Post from "./Post";
import { addProgress } from "./LoadScreen"
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

export default function PostsTab() {
    const [width, setWidth] = useState(1000)
    const [posts, setPosts] = useState(["Fetching"])
    let token = Cookie.get("token")

    useEffect(() => {
        setWidth(window.innerWidth)
        const onDeviceResize = () => {
            setWidth(window.innerWidth)
        }
    addEventListener("resize", onDeviceResize)
    fetchPosts()
    }, [])

    const fetchPosts = async () => {
        try {
          const fetch = await axios.post("/api/loadFeed", { token })
          const data = fetch.data
          setPosts(data)
          console.log(data)
          addProgress("posts")
        } catch (err) {
          console.error(err.response.data)
          if (err.response.data == "No communities") {
            setPosts(["No communities"])
          }
        }
      }

    return (
        <div className="inline-flex flex-col space-y-3 items-center justify-start bg-[#363636] w-full h-full px-[15px] pt-2.5 rounded-tr-xl">
        {
          posts[0] == "Fetching" ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-xl font-semibold text-[#545454] text-center">Fetching posts...</p>
            </div>
          ) : posts[0] == "No communities" ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Image
              src={"/images/wluffy_wires_light.png"}
              width={300}
              height={300}
              className="rounded-2xl mb-2 grayscale-1 brightness-50 opacity-40 -mt-10"
              />
              <p className="text-xl font-semibold text-[#545454] text-center">No communities or no posts in your communities yet...<br></br>Join some to load feed!</p>
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
    )
}