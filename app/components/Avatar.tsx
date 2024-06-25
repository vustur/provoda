import Image from "next/image"

type Props = {
    src: String,
    size: String,
    pixels: numbers,
    nomargin: boolean
}

export default function Avatar({src, size, pixels, nomargin} : Props) {

    return (
    <div className={`${nomargin ? "" : "mr-4"}`}
    style={{width: `${size}rem`, height: `${size}rem`}}>
        <Image
            src={src ? src : "/images/default.png"}
            width={pixels}
            height={pixels}
            className="rounded-2xl"
            alt="Pfp"
            style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
            }}
        />
    </div>
    )
}