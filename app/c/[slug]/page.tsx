export default function main({ params }: { params: { slug: string } }){
    return (
        <a>Route for commun page {params.slug}</a>
    )
}