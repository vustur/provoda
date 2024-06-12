import Image from "next/image"

type Props = {
    tag: String
}

export default function CommunPreview({ tag }: Props) {
    return (
        <div className="inline-flex flex-row mb-2 items-center justify-start bg-[#333333] w-full rounded-lg p-3 cursor-pointer"
        onClick={() => window.location = "/c/" + tag}>
            <Image
                src={"/images/placeholder.jpg"}
                width={40}
                height={40}
                className="rounded-xl mr-4"
                alt="placeholder"
            />
            <div className="inline-flex flex-col items-start justify-start">
                <p className="text-2xl font-semibold text-[#f1f1f1] truncate"># {tag}</p>
            </div>
        </div>
    )
}
