'use client'
import ProfileTab from "@/app/components/ProfileTab"
import CommunityTab from "@/app/components/CommunityTab"
import PostsTab from "@/app/components/PostsTab"
import Top from "@/app/components/Top"
import LoadScreen from "@/app/components/LoadScreen"

export default function main({ params }: { params: { slug: string } }){
    return (
        <div className="absolute bg-[#2a2a2a] w-full h-full flex flex-col">
        <LoadScreen reqLenght={3} />
        <Top />
            {/* Main part of page */}
            <div className="w-full h-full flex flex-row">
              <CommunityTab />
              <PostsTab commun={params.slug} />
              <ProfileTab commun={params.slug} />
            </div>
        </div>
    )
}