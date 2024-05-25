'use client'
import Image from "next/image"

type Props = {
    src: string;
    isSpecial?: boolean | undefined; // isSpecial = purp frame
}
export default ({ src, isSpecial }: Props) => {
    const alt = src.split('/').pop().split('.')[0]
    const pSrc = "/icons/" + src + ".svg"
    return (
        <div className="cursor-pointer">
            {!isSpecial ? (
                <Image
                    src={pSrc}
                    alt={alt}
                    width={32}
                    height={32}
                />
            ) : (
                <div className="items-center justify-between relative bg-[#816b9d] rounded-md">
                    <Image
                        src={pSrc}
                        alt={alt}
                        width={32}
                        height={32}
                        className="p-0.5"
                    />
                </div>
            )}
        </div>
    )
}
