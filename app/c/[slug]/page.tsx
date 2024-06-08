'use client'
import ProfileTab from "@/app/components/ProfileTab"
import CommunityTab from "@/app/components/CommunityTab"
import PostsTab from "@/app/components/PostsTab"
import Top from "@/app/components/Top"
import PageBase from "@/app/components/PageBase"

export default function main({ params }: { params: { slug: string } }){
    return (
        <PageBase>
        <Top />
            {/* Main part of page */}
            <div className="w-full h-full flex flex-row">
              <CommunityTab />
              <PostsTab commun={params.slug} />
              <ProfileTab commun={params.slug} />
            </div>
        </PageBase>
    )
}