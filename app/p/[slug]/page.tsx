export default function main({ params }: { params: { slug: string } }){
    return (
        <a>Route for post page {params.slug}</a>
    )
}