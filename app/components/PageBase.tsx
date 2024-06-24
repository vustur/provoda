import { createContext, useState, useEffect } from "react"

export const mainContext = createContext()

export default function PageBase({ children }) {
    const [ctxVal, setCtxVal] = useState()
    const [width, setWidth] = useState(1000)

    useEffect(() => {
        setWidth(window.innerWidth)
        const onDeviceResize = () => {
          setWidth(window.innerWidth)
        }
        addEventListener("resize", onDeviceResize)
      }, [])

    return (
        <mainContext.Provider value={{ctxVal, setCtxVal}}>
            <div className={`absolute bg-[#2a2a2a] w-full flex overflow-hidden ${width <= 500 ? "h-full flex-col-reverse" : "h-full flex-col"}`}>{children}</div>
        </mainContext.Provider>
    );
}