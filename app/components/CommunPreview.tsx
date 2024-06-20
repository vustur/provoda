import Image from "next/image"

type Props = {
    tag: String
    pfp: String
}

export default function CommunPreview({ tag, pfp }: Props) {
    return (
        <div className="inline-flex flex-row mb-2 items-center justify-start bg-[#333333] w-full rounded-lg p-3 cursor-pointer"
            onClick={() => window.location = "/c/" + tag}>
            {/* <Image
                src={pfp ? pfp : "/images/default.png"}
                width={40}
                height={40}
                className="rounded-xl mr-4"
                alt="Pfp"
            /> */}
            <div className="w-20 h-20 mr-4">
                <Image
                    src={pfp ? pfp : "/images/default.png"}
                    width={80}
                    height={80}
                    className="rounded-2xl"
                    alt="Pfp"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                    }}
                />
            </div>
            <div className="inline-flex flex-col items-start justify-start">
                <p className="text-2xl font-semibold text-[#f1f1f1] truncate"># {tag}</p>
            </div>
        </div>
    )
}
