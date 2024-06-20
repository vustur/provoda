import Image from "next/image"

type Props = {
    image: string
    textOne: string
    textTwo: string
    scale: number
}

export default function WluffyError({ image, textOne, textTwo, scale }: Props) {
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
            </div>
        </div>
    )
}