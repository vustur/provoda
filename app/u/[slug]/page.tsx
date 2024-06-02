export default function main({ params }: { params: { slug: string } }){
    return (
        <a>Route for user page {params.slug}</a>
    )
}