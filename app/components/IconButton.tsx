'use client'
import Image from "next/image"

type Props = {
    src?: string;
    isSpecial?: boolean | undefined; // isSpecial = purp frame
    onClick?: () => void
    text?: string
    className?: string
    isTextCentered?: boolean
    isDisabled?: boolean
}
export default ({ src, isSpecial, onClick, text, className, isTextCentered, isDisabled }: Props) => {
    let alt
    let pSrc
    if (src) {
        alt = src.split('/').pop().split('.')[0]
        pSrc = "/icons/" + src + ".svg"
    }
    return (
        <button className={`cursor-pointer flex flex-row w-fit 
            ${isSpecial ? "items-center relative rounded-md p-0.5 transition-all duration-150 ease-in-out" : null} 
            ${isSpecial && isDisabled ? "bg-[#5f5f5f]" : isSpecial ? "bg-[#816b9d] hover:bg-[#9179b4]" : null}
            ${isDisabled ? "cursor-not-allowed" : null}
            ${text ? "p-1" : null} ${className}`}
            onClick={onClick}
            disabled={isDisabled}>
            {src &&
                <Image
                    src={pSrc}
                    alt={alt}
                    width={text ? 24 : 32}
                    height={text ? 24 : 32}
                    className={text ? "pr-0.5" : null}
                />
            }
            {text ? <p className={`font-semibold ${isDisabled ? "text-[#939393]" : "text-[#ebebeb]"} ${isTextCentered ? "text-center w-full text-lg" : "text-sm"} `}>{text}</p> : null}
        </button>
    )
}
