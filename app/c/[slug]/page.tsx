'use client'
import ProfileTab from "@/app/components/ProfileTab"
import CommunityTab from "@/app/components/CommunityTab"
import PostsTab from "@/app/components/PostsTab"
import Top from "@/app/components/Top"
import PageBase from "@/app/components/PageBase"
import MainContent from "@/app/components/MainContent"

export default function main({ params }: { params: { slug: string } }) {
    return (
        <PageBase>
            <Top />
            <MainContent>
                <CommunityTab />
                <PostsTab commun={params.slug} />
                <ProfileTab commun={params.slug} />
            </MainContent>
        </PageBase>
    )
}