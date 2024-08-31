import Image from "next/image"
import Button from "./IconButton"

type Props = {
    image: string
    textOne: string
    textTwo: string
    scale: number
    buttonText: string
    buttonFunc: () => void
}

export default function WluffyError({ image, textOne, textTwo, scale, buttonText, buttonFunc }: Props) {
    return (
        <div className="flex items-center justify-center h-full w-full">
            <div className="mx-auto flex flex-col items-center justify-center">
                <Image
                    src={"/images/" + image}
                    width={scale ? scale : 300}
                    height={scale ? scale : 300}
                    className="rounded-2xl mb-2 grayscale-0 brightness-50 opacity-40 -mt-10"
                    alt="Wluffy (Wires cat)"
                    style={{ imageRendering: "pixelated" }}
                />
                <p className="text-2xl font-bold text-[#878787] text-center">{textOne}</p>
                <p className="text-lg  font-bold text-[#878787] text-center">{textTwo}</p>
                { buttonText &&
                    <Button
                    text={buttonText}
                    isSpecial={true}
                    isTextCentered={true}
                    className="mt-2 px-3"
                    onClick={buttonFunc}
                    />
                }
            </div>
        </div>
    )
}