'use client'
import Image from "next/image"

type Props = {
    src: string;
    isSpecial?: boolean | undefined; // isSpecial = purp frame
    onClick?: () => void
    text?: string
    className?: string
}
export default ({ src, isSpecial, onClick, text, className }: Props) => {
    const alt = src.split('/').pop().split('.')[0]
    const pSrc = "/icons/" + src + ".svg"
    return (
        <div className={`cursor-pointer flex flex-row w-fit ${isSpecial ? "items-center relative bg-[#816b9d] rounded-md p-0.5" : null} ${text ? "p-1" : null} ${className}`}
            onClick={onClick}>
            <Image
                src={pSrc}
                alt={alt}
                width={text ? 24 : 32}
                height={text ? 24 : 32}
                className={text ? "pr-0.5" : null}
            />
            {text ? <p className="text-sm font-semibold text-[#ebebeb]">{text}</p> : null}
        </div>
    )
}
