import Image from "next/image"

type Props = {
    nick: String
    tag: String
    bio: String
}

export default function UserPreview({ nick, tag, bio }: Props) {
    return (
        <div className="inline-flex flex-row items-center justify-start bg-[#333333] w-full rounded-lg p-3 mb-2 cursor-pointer"
        onClick={() => window.location = "/u/" + tag}>
            <Image
                src={"/images/placeholder.jpg"}
                width={40}
                height={40}
                className="rounded-2xl mr-4"
                alt="placeholder"
            />
            <div className="inline-flex flex-col items-start justify-start">
                <p className="text-xl     font-semibold text-[#f1f1f1] truncate">{nick}</p>
                <p className="text-base   font-semibold text-[#bababa] truncate">@ {tag}</p>
                <p className="text-sm     font-semibold text-[#bababa]         ">{bio}</p>
            </div>
        </div>
    )
}