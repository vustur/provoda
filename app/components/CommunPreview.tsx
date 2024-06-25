import Image from "next/image"
import Avatar from "./Avatar"

type Props = {
    tag: String
    pfp: String
}

export default function CommunPreview({ tag, pfp }: Props) {
    return (
        <div className="inline-flex flex-row mb-2 items-center justify-start bg-[#333333] w-full rounded-lg p-3 cursor-pointer"
            onClick={() => window.location = "/c/" + tag}>
            <Avatar
                src={pfp}
                size={5}
                pixels={80}
            />
            <div className="inline-flex flex-col items-start justify-start">
                <p className="text-2xl font-semibold text-[#f1f1f1] truncate"># {tag}</p>
            </div>
        </div>
    )
}
