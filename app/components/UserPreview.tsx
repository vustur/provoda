import Image from "next/image"
import Button from "./IconButton"

type Props = {
    nick: String
    tag: String
    bio: String
    specButton: String
    specFunc: () => void
}

export default function UserPreview({ nick, tag, bio, specButton, specFunc }: Props) {
    return (
        <div className="inline-flex items-start justify-between w-full bg-[#333333] mb-2">
            <div className="inline-flex flex-row items-center justify-start w-[90%] rounded-lg p-3 mb-2 cursor-pointer"
                onClick={() => window.location = "/u/" + tag}>
                <Image
                    src={"/images/placeholder.jpg"}
                    width={40}
                    height={40}
                    className="rounded-2xl mr-4"
                    alt="placeholder"
                />
                <div className="inline-flex flex-col items-start justify-start">
                    <p className="text-xl     font-semibold text-[#f1f1f1] truncate">{nick ? nick : ""}</p>
                    <p className="text-base   font-semibold text-[#bababa] truncate">@ {tag ? tag : ""}</p>
                    <p className="text-sm     font-semibold text-[#bababa]         ">{bio ? bio : ""}</p>
                </div>
            </div>
            {specButton &&
                <div className="flex items-center justify-center w-[10%] mt-auto mb-auto">
                    <Button
                        isSpecial={true}
                        src={specButton}
                        onClick={() => specFunc()}
                    />
                </div>
            }
        </div>
    )
}