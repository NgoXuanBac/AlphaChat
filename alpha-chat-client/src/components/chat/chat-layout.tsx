"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";

import { ChatBox } from "./chat-box";
import { Layout } from "@/extenstions/models";
import { setCookie } from "cookies-next";
import { ChatProvider } from "@/contexts/ChatContext";
import { WebSocketProvider } from "@/contexts/SocketContext";
import Sidebar from "../sidebar";

interface ChatLayoutProps {
  defaultLayout: Layout | undefined;
  defaultCollapsed?: boolean;
  navCollapsedSize: number;
}

export function ChatLayout({
  defaultLayout = { sidebarSize: 320, chatBoxSize: 480 },
  defaultCollapsed = false,
  navCollapsedSize,
}: ChatLayoutProps) {

  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenWidth = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenWidth();

    window.addEventListener("resize", checkScreenWidth);
    return () => {
      window.removeEventListener("resize", checkScreenWidth);
    };
  }, []);

  return (
    <WebSocketProvider>
      <ChatProvider>
        <ResizablePanelGroup
          direction="horizontal"
          onLayout={(sizes: number[]) => {
            const layout: Layout = { sidebarSize: sizes[0], chatBoxSize: sizes[1] }
            setCookie("react-resizable-panels:layout", layout)
          }}
          className="h-full items-stretch"
        >
          <ResizablePanel
            defaultSize={defaultLayout.sidebarSize}
            collapsedSize={navCollapsedSize}
            collapsible={true}
            minSize={isMobile ? 0 : 24}
            maxSize={isMobile ? 8 : 30}
            onCollapse={() => {
              setIsCollapsed(true);
              setCookie("react-resizable-panels:collapsed", true);
            }}
            onExpand={() => {
              setIsCollapsed(false);
              setCookie("react-resizable-panels:collapsed", false);
            }}
            className={cn(
              isCollapsed && "min-w-[50px] md:min-w-[70px] transition-all duration-300 ease-in-out"
            )}
          >
            <Sidebar
              isCollapsed={isCollapsed || isMobile}
              isMobile={isMobile}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={defaultLayout.chatBoxSize} minSize={30}>
            <ChatBox
              isMobile={isMobile}
            />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ChatProvider>
    </WebSocketProvider>
  );
}
