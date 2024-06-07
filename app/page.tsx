'use client'
import ProfileTab from "./components/ProfileTab";
import CommunityTab from "./components/CommunityTab";
import PostsTab from "./components/PostsTab";
import Top from "./components/Top";
import PageBase from "./components/PageBase";

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
