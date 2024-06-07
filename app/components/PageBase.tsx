import { createContext, useState } from "react"

export const mainContext = createContext()

export default function PageBase({ children }) {
    const [ctxVal, setCtxVal] = useState()

    return (
        <mainContext.Provider value={{ctxVal, setCtxVal}}>
            <div className="absolute bg-[#2a2a2a] w-full h-full flex flex-col">{children}</div>
        </mainContext.Provider>
    );
}