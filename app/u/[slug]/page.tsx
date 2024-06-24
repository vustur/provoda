'use client'
import ProfileTab from "@/app/components/ProfileTab"
import CommunityTab from "@/app/components/CommunityTab"
import OpenedUserTab from "@/app/components/OpenedUserTab"
import Top from "@/app/components/Top"
import PageBase from "@/app/components/PageBase"
import MainContent from "@/app/components/MainContent"

export default function main({ params }: { params: { slug: string } }) {
    return (
        <PageBase>
            <Top />
            <MainContent>
                <CommunityTab />
                <OpenedUserTab nick={params.slug} />
                <ProfileTab />
            </MainContent>
        </PageBase>
    )
}