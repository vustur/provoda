'use client'
import ProfileTab from      "./components/ProfileTab";
import CommunityTab from    "./components/CommunityTab";
import PostsTab from        "./components/PostsTab";
import Top from             "./components/Top";
import LoadScreen from      "./components/LoadScreen";

export default function Home() {
  return (
  <div className="absolute bg-[#2a2a2a] w-full h-full flex flex-col">
    <LoadScreen reqLenght={4} />
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
