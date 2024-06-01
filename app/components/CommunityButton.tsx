'use client'

type Props = {
    name: string
}

export default ({ name }: Props) => {
    return (
        <button className="text-lg text-[#c1c1c1] hover:text-purple-300 transition ease-in-out duration-300 truncate"
        onClick={() => null}
        ># {name}
        </button>
    )
}