import { useState, useEffect } from "react"

export default function MainContent({ children }) {
    const [width, setWidth] = useState(1000)

    useEffect(() => {
        setWidth(window.innerWidth)
        const onDeviceResize = () => {
          setWidth(window.innerWidth)
        }
        addEventListener("resize", onDeviceResize)
      }, [])

    return (
        <div className={`w-full h-full flex flex-row ${width > 500 ? "pb-12" : "pt-12"}`}>
            {children}
        </div>
    )
}