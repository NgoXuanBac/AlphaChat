"use client"
import { ChatLayout } from "@/components/chat/chat-layout";
import { Layout } from "@/extenstions/models";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import Loading from "./loading";
import withAuth from "@/guards/AuthGuard";
import withFirstTime from "@/guards/FirstTimeGuard";


const Home = () => {
  const [defaultLayout, setDefaultLayout] = useState<Layout | null>(null)
  useEffect(() => {
    const json = getCookie("react-resizable-panels:layout")?.valueOf()

    setDefaultLayout(json ? JSON.parse(json) : undefined)
  }, [])
  if (defaultLayout === null) {
    return <Loading />
  }

  return (
    <main className="flex h-[calc(100dvh)] flex-col items-center justify-center p-4 md:px-24 py-4 gap-4 bg-[#fdfdfd]">
      <div className="z-10 border rounded-lg max-w-5xl w-full h-full text-sm lg:flex shadow-md">
        <ChatLayout defaultLayout={defaultLayout} navCollapsedSize={8} />
      </div>
    </main>
  )
}
export default withAuth(withFirstTime(Home))

