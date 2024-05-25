'use client'
import Image from "next/image"

type Props = {
    title: String
    author: String
    community: String
    textContent: String
    rating: Number
    date: String
}

export default ({ title, author, community, textContent, rating, date }: Props) => {
    return (
    <div className="w-full inline-flex items-start justify-center bg-[#333333] p-2.5 rounded-sm">
        <div className="inline-flex flex-col items-start justify-center">
            <p className="text-2xl font-semibold text-[#dcdcdc]">{title}</p>
            <div className="inline-flex items-center mt-1 justify-between relative w-full h-4">
                <p className="text-sm font-semibold text-[#7c7c7c]"># {community} </p>
                <p className="text-sm font-semibold text-[#757474]">@ {author}  //  {date}</p>
            </div>
            <p className="text-lg mt-1 text-[#dcdcdc]">{textContent}</p>
        </div>
        <div className="inline-flex flex-col ml-5 mr-3 items-center justify-center relative w-5 h-fit">
            <Image
            src={"/icons/chevron_up.svg"}
            alt="Up"
            height={32}
            width={32} 
            className=""
            />
            <p className="text-md font-bold text-[#f2f2f2]">{rating.toString()}</p>
            <Image
            src={"/icons/chevron_up.svg"}
            alt="Up"
            height={32}
            width={32} 
            className="rotate-180"
            />
        </div>
    </div>
    )
}