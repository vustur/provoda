'use client'
import ProfileTab from      "./components/ProfileTab";
import CommunityTab from    "./components/CommunityTab";
import PostsTab from        "./components/PostsTab";
import Top from             "./components/Top";

export default function Home() {
  return (
  <div className="absolute bg-[#2a2a2a] w-full h-full flex flex-col">
    <Top />
      {/* Main part of page */}
      <div className="w-full h-full flex flex-row">
          <CommunityTab />
          <PostsTab />
          <ProfileTab />
      </div>
  </div>
  );
}
