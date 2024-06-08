'use client'
import ProfileTab from "@/app/components/ProfileTab"
import CommunityTab from "@/app/components/CommunityTab"
import OpenedUserTab from "@/app/components/OpenedUserTab"
import Top from "@/app/components/Top"
import PageBase from "@/app/components/PageBase"

export default function main({ params }: { params: { slug: string } }){
    return (
        <PageBase>
        <Top />
          {/* Main part of page */}
          <div className="w-full h-full flex flex-row">
              <CommunityTab />
              <OpenedUserTab nick={params.slug} />
              <ProfileTab />
          </div>
      </PageBase>
    )
}