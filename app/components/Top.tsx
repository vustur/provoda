import { useState, useEffect } from "react"
import Button from "./Button"

export default function Top() {
    const [width, setWidth] = useState(1000)
  
    useEffect(() => {  
      setWidth(window.innerWidth)
      const onDeviceResize = () => {
        setWidth(window.innerWidth)
      }
      addEventListener("resize", onDeviceResize)
    }, [])
    return (
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
    )
}