'use client'
import ProfileTab from "@/app/components/ProfileTab";
import CommunityTab from "@/app/components/CommunityTab";
import PostsTab from "@/app/components/PostsTab";
import Top from "@/app/components/Top";
import PageBase from "@/app/components/PageBase";

export default function Home() {
  return (
    <PageBase>
        <Top />
        {/* Main part of page */}
        <div className="w-full h-full flex flex-row">
          <CommunityTab />
          <PostsTab />
          <ProfileTab />
        </div>
    </PageBase>
  );
}
