import Image from "next/image"

export default function About() {

    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <p className="w-fit mt-20 cursor-help font-bold text-6xl bg-clip-text text-transparent bg-gradient-to-r from-[#e0e0e0] to-[#9354B1]"
            >Provoda</p>
            <p className="text-xl font-bold text-[#acabab]">Modern forum for communities</p>
            <p className="text-xl font-bold text-[#474747]">This page obviosly not ready...</p>
            <button className="bg-purple-500 hover:bg-purple-600 bg-opacity-80 text-white font-bold py-2 px-4 rounded mt-6 transition-all duration-150 ease-in-out">Main page</button>
        </div>
    )
}