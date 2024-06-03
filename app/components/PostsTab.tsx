
import Post from "./Post";
import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

type Props = {
  commun : String
}

export default function PostsTab({ commun }: Props) {
    const [width, setWidth] = useState(1000)
    const [posts, setPosts] = useState(["Fetching"])
    const [communData, setCommunData] = useState(["Fetching"])
    let token = localStorage.getItem("token")

    useEffect(() => {
        setWidth(window.innerWidth)
        const onDeviceResize = () => {
            setWidth(window.innerWidth)
        }
    addEventListener("resize", onDeviceResize)
    if (commun != null) {
        fetchPostsByCommun(commun)
        fetchCommun()
    } else {
      fetchFeed()
    }
    }, [])

    const fetchFeed = async () => {
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

    return (
        <div className="inline-flex flex-col space-y-3 items-center justify-start bg-[#363636] w-full h-full px-[15px] pt-3 rounded-tr-xl">
            { commun != null && communData[0] != "Fetching" ? (
              <div className="inline-flex flex-row items-center justify-start bg-[#2d2d2d] w-full rounded-t-xl p-3">
                <Image
                src={"/images/placeholder.jpg"}
                width={80}
                height={80}
                className="rounded-2xl mr-4"
                />
                <div className="inline-flex flex-col items-start justify-start">
                  <p className="text-2xl font-semibold text-[#f1f1f1]"># {communData['main']['tag']}</p>
                  <p className="text-lg font-semibold text-[#bababa]">{communData['mems'] + " members"}</p>
                </div>
              </div>
            ) : null
            }
        {
          posts[0] == "Fetching" ? (
            <div className="flex flex-col items-center justify-center h-full">
              <p className="text-xl font-semibold text-[#545454] text-center">Fetching posts...</p>
            </div>
          ) : posts[0] == "No communities" || posts[0] == "No posts" || posts[0] == "Community not found" ? (
            <div className="flex flex-col items-center justify-center h-full">
              <Image
              src={"/images/wluffy_wires_light.png"}
              width={300}
              height={300}
              className="rounded-2xl mb-2 grayscale-1 brightness-50 opacity-40 -mt-10"
              />
              { posts[0] == "No communities" ?
              <p className="text-xl font-semibold text-[#545454] text-center">No communities or no posts in your communities yet...<br></br>Join some to load feed!</p>
              : posts[0] == "No posts" ?
              <p className="text-xl font-semibold text-[#545454] text-center">No posts in this community yet...<br></br>Post something first!</p>
              : posts[0] == "Community not found" ?
              <p className="text-xl font-semibold text-[#545454] text-center">Community not found...</p>
              : null 
            }
            </div>
          ) : posts.length > 0 && posts[0] != "No communities" && posts[0] != "No posts" && posts[0] != "Fetching" ? (
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