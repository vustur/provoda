import Post from "./Post";
import Comment from "./Comment";
import { useEffect, useState, useContext } from "react";
import { mainContext } from "./PageBase"
import axios from "axios";
import Image from "next/image";
import WluffyError from "./WluffyError";

type Props = {
  nick: String
}

export default function PostsTab({ nick }: Props) {
  const [width, setWidth] = useState(1000)
  const [accountData, setAccountData] = useState("Fetching")
  const [accountContent, setAccountContent] = useState("Fetching")
  const [accRep, setAccRep] = useState("Fetching")
  const { ctxVal, setCtxVal } = useContext(mainContext)
  let token = typeof window !== "undefined" ? window.localStorage.getItem('token') : null

  useEffect(() => {
    setWidth(window.innerWidth)
    const onDeviceResize = () => {
      setWidth(window.innerWidth)
    }
    addEventListener("resize", onDeviceResize)
    refresh()
    setCtxVal(prevVal => ({ ...prevVal, refresh: () => refresh() }))
  }, [])

  const refresh = () => {
    fetchUser()
    fetchContent()
  }

  const fetchUser = async () => {
    try {
      const fetch = await axios.post("/api/getAccount", { input: nick })
      const data = fetch.data[0]
      console.log(data)
      setAccountData(data)
      fetchRep()
    } catch (err) {
      console.error(err.response.data)
      if (err.response.data == "Acc not found") {
        setAccountData(["Not found"])
      } else {
        setAccountData(["Error"])
      }
    }
  }

  const fetchContent = async () => {
    try {
      const fetch = await axios.post("/api/getAccountContent", { tag: nick })
      const data = fetch.data
      console.log(data)
      let posts = data.posts
      let comments = data.comments
      posts.forEach(post => {
        let p = post.date.split(", ")[0].split(".")
        p.push(...post.date.split(", ")[1].split(":"))
        // ^^^ outputs: 06, 06, 2024, 23, 03
        const d = `${p[2]}-${p[1]}-${p[0]}T${p[3]}:${p[4]}:00Z`
        post.sortDate = new Date(d)
        post.type = "post"
      })
      comments.forEach(comment => {
        let p = comment.date.split(", ")[0].split(".")
        p.push(...comment.date.split(", ")[1].split(":"))
        const d = `${p[2]}-${p[1]}-${p[0]}T${p[3]}:${p[4]}:00Z`
        comment.sortDate = new Date(d)
        comment.type = "comment"
      })
      const content = [...posts, ...comments].sort((a, b) => b.sortDate - a.sortDate)
      setAccountContent(content)
      console.log(content)
    } catch (err) {
      console.error(err.response.data)
      if (err.response.data == "Acc not found") {
        setAccountContent(["Not found"])
      }
      if (err.response.data == "No content") {
        setAccountContent(["No content"])
      }
    }
  }

  const fetchRep = async () => {
    try {
      const fetch = await axios.post("/api/getAccountReput", { tag: nick })
      const data = fetch.data
      console.log(data)
      setAccRep(data)
    } catch (err) {
      console.error(err.response.data)
      if (err.response.data == "Acc not found") {
        setAccRep(["Not found"])
      }
    }
  }

  return (
    <div className="inline-flex flex-col space-y-3 items-center justify-start bg-[#363636] w-full h-full px-[15px] pt-3 rounded-tr-xl pb-16"
      style={{ overflowY: "scroll" }}>
      {accountData != "Fetching" && accountData != "Not found" ? (
        <div className="inline-flex flex-row items-center justify-start bg-[#2d2d2d] w-full rounded-t-xl p-3">
          <Image
            src={accountData.pfp ? accountData.pfp : "/images/default.png"}
            width={80}
            height={80}
            className="rounded-2xl mr-4"
            alt="Pfp"
          />
          <div className="inline-flex flex-col items-start justify-start">
            <p className="text-2xl   font-semibold text-[#f1f1f1] truncate">{accountData.nick}</p>
            <p className="text-lg    font-semibold text-[#bababa] truncate">@ {accountData.tag}</p>
            <p className="text-base  font-semibold text-[#8f8f8f]         ">{accRep != "Fetching" ? `Rep: ${accRep.allRep} // Comment rep: ${accRep.commRep} // Post rep: ${accRep.postRep}` : null}</p>
            <p className="text-base  font-semibold text-[#bababa]         ">{accountData.bio}</p>
          </div>
        </div>
      ) : accountData == "Fetching" ? (
        <p className="text-xl font-semibold text-[#545454] text-center">Fetching account...</p>
      ) : accountData == "Not found" ? (
        <WluffyError
          image="wluffy_wires_light.png"
          textOne="Account not found"
        />
      ) : null}
      {accountContent != "Fetching" && accountContent != "No content" && accountData != "Not found" && accountData != "Error" ? (
        accountContent.map((cntn) => {
          if (cntn.type == "post") {
            return (
              <Post
                key={cntn.id}
                postid={cntn.id}
                title={JSON.parse(cntn.content)['title']}
                textContent={JSON.parse(cntn.content)['text']}
                date={cntn.date}
                author={cntn.authortag}
                community={cntn.commun}
                reputation={cntn.reputation}
                isOpen={false}
                attach={JSON.parse(cntn.content)['attach']}
              />
            )
          }
          if (cntn.type == "comment") {
            console.log(cntn)
            return (
              <Comment
                key={cntn.id}
                postid={cntn.postId}
                textContent={cntn.content}
                date={cntn.date}
                authortag={cntn.authortag}
                reputation={cntn.reputation}
                showOrig={true}
                commid={cntn.id}
              />
            )
          }
        })
      ) : accountContent == "Fetching" ? (
        <p className="text-xl font-semibold text-[#545454] text-center">Fetching user content...</p>
      ) : accountContent == "No content" ? (
        <p className="text-2xl font-semibold text-[#545454] text-center">No user content</p>
      ) : null
      }
    </div>
  )
}