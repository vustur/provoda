import Image from "next/image"
import { useContext } from "react"
import { mainContext } from "./PageBase"

type Props = {
    src: String,
    size: String,
    pixels: numbers,
    nomargin: boolean,
    className: string
}

export default function Avatar({src, size, pixels, nomargin, className} : Props) {
    const { ctxVal, useCtxVal } = useContext(mainContext)

    return (
    <div className={`${nomargin ? "" : "mr-4"} ${className}`}
    style={{width: `${size}rem`, height: `${size}rem`, minWidth: `${size}rem`, minHeight: `${size}rem`,}}>
        <Image
            src={src ? src : "/images/default.png"}
            width={pixels}
            height={pixels}
            className={`rounded-2xl ${src ? "cursor-pointer" : null}`}
            alt="Pfp"
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
            }}
            onClick={src ? () => ctxVal.openPictureView(src) : () => (null)}
        />
    </div>
    )
}