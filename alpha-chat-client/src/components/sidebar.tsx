"use client";

import Link from "next/link";
import { MoreHorizontal, SquarePen, ChevronLeft, LogOut, UserRound, BookUser } from "lucide-react";
import { cn, isValidEmail } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Avatar, AvatarImage } from "./ui/avatar";
import { AnimatePresence, motion } from "framer-motion";
import { memo, useEffect, useRef, useState } from "react";
import chatService from "@/services/chatService";
import { Chat } from "@/app/data";
import { useChat } from "@/hooks/useChat";
import { Popover, PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import AuthService from "@/services/authService";
import { useAuth } from "@/hooks/useAuth";
import { signOut } from "@/contexts/auth/reducers";
import Role from "@/extenstions/roles";


interface SidebarProps {
  isCollapsed: boolean;
  isMobile: boolean;
}

const Sidebar = ({ isCollapsed }: SidebarProps) => {
  const { user, dispatch } = useAuth()
  const { selectedChat, setSelectedChat, chats } = useChat()
  const [search, setSearch] = useState("");
  const [viewChats, setViewChats] = useState(chats)
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!search.trim())
      setViewChats(chats)
  }, [chats])
  console.log("render sidebar");



  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value)
    onSearch(event.target.value)
  }

  const resetSearch = () => {
    setSearch("")
    setViewChats(chats)
  }

  const onSearch = async (search: string) => {
    search = search.trim().toLowerCase()
    if (!search) {
      return resetSearch()
    }

    let foundChats = chats!.filter(c => c.name.toLowerCase().includes(search))

    if (isValidEmail(search)) {
      const foundChat = await searchByEmail(search);
      if (foundChat)
        foundChats.push(foundChat)

    }
    setViewChats(foundChats)
  }

  const searchByEmail = async (email: string) => {

    try {
      var response = await chatService.findByEmail(email)

      return {
        id: response.data.id,
        name: response.data.name,
        avatar: response.data.avatar,
        email,
        lastMessage: ""
      }
    } catch (error) {
      console.log(error);

      return null
    }
  }


  const handleSelectChat = (link: Chat): void => {
    setSelectedChat(link)
  }

  const handleLogout = async () => {
    await AuthService.signout()
    console.log("=====> Logout");
    dispatch(signOut())

  }

  return (
    <div
      data-collapsed={isCollapsed}
      className="relative group flex flex-col h-full gap-4 p-2 data-[collapsed=true]:p-2"
    >
      {!isCollapsed && (
        <div>
          <div className="flex justify-between p-2 items-center flex-wrap">
            <div className="flex gap-2 items-center text-2xl">
              <p className="font-medium">Chats</p>
            </div>

            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Link
                    href="#"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "h-9 w-9",
                      "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                    )}
                  >
                    <MoreHorizontal size={20} />
                  </Link>
                </PopoverTrigger>
                <PopoverContent
                  side="top"
                  className="w-full p-2 shadow-sm border rounded z-50 bg-white"

                >
                  <div className="flex flex-col">
                    <Link
                      href="/user"
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "h-9 w-full flex justify-start gap-x-2 px-1",
                        "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
                      )}
                    >
                      <UserRound size={16} className="text-muted-foreground" /> <span className="text-xs">Profile</span>
                    </Link>

                    <Link
                      href="/login"
                      className={cn(
                        buttonVariants({ variant: "ghost", size: "icon" }),
                        "h-9 w-full flex justify-start gap-x-2 px-1",
                        "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
                      )}
                      onClick={handleLogout}
                    >
                      <LogOut size={16} className="text-muted-foreground" /> <span className="text-xs">Logout</span>
                    </Link>

                    {user?.roles.includes(Role.Admin) &&
                      <Link
                        href="/admin"
                        className={cn(
                          buttonVariants({ variant: "ghost", size: "icon" }),
                          "h-9 w-full flex justify-start gap-x-2 px-1",
                          "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
                        )}
                      >
                        <BookUser size={16} className="text-muted-foreground" /> <span className="text-xs">Manager</span>
                      </Link>
                    }

                  </div>
                </PopoverContent>
              </Popover>



            </div>

          </div>
          <div className="flex items-center">

            {(search.trim()) && (
              <Link
                href="#"
                className={cn(
                  buttonVariants({ variant: "ghost", size: "icon" }),
                  "h-8 w-10"
                )}
                onClick={resetSearch}
              >
                <ChevronLeft size={18} />
              </Link>
            )}
            <AnimatePresence initial={false}>
              <motion.div
                key="input"
                className="w-full relative"
                layout
                initial={{ opacity: 0, scale: 1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1 }}
                transition={{
                  opacity: { duration: 0.05 },
                  layout: {
                    type: "spring",
                    bounce: 0.15,
                  },
                }}
              >
                <input
                  type="text" name="search"
                  value={search}
                  ref={inputRef}
                  onChange={e => handleInputChange(e)}
                  placeholder="Search..."
                  className={cn("flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
                    "w-full shadow-none border-none rounded-full flex items-center h-8 resize-none overflow-hidden bg-accent"
                  )}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
      <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2 
                      overflow-y-auto overflow-x-hidden no-scrollbar"
      >
        {viewChats.map((link, index) =>
          isCollapsed ? (
            <TooltipProvider key={index}>
              <Tooltip key={index} delayDuration={0}>
                <TooltipTrigger asChild>
                  <Link
                    href="#"
                    className={cn(
                      buttonVariants({ variant: selectedChat?.id === link.id ? "grey" : "ghost", size: "icon" }),
                      "h-11 w-11 md:h-16 md:w-16",
                      selectedChat?.id === link.id &&
                      "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                    )}
                    onClick={e => handleSelectChat(link)}
                  >
                    <Avatar className="flex justify-center items-center">
                      <AvatarImage
                        src={link.avatar}
                        alt={link.avatar}
                        width={6}
                        height={6}
                        className="w-10 h-10 "
                      />
                    </Avatar>{" "}
                    <span className="sr-only">{link.name}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent
                  side="right"
                  className="flex items-center gap-4"
                >
                  {link.name}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ) : (
            <Link
              key={index}
              href="#"
              className={cn(
                buttonVariants({ variant: selectedChat?.id === link.id ? "grey" : "ghost", size: "xl" }),
                selectedChat?.id === link.id &&
                "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white shrink",
                "justify-start gap-4"
              )}
              onClick={e => handleSelectChat(link)}
            >
              <Avatar className="flex justify-center items-center">
                <AvatarImage
                  src={link.avatar}
                  alt={link.avatar}
                  width={6}
                  height={6}
                  className="w-10 h-10 "
                />
              </Avatar>
              <div className="flex flex-col max-w-28">
                <span>{link.name}</span>
                {link.lastMessage &&
                  <span className="text-zinc-300 text-xs truncate text-gray-400 font-light">
                    {link.lastMessage}
                  </span>
                }
              </div>
            </Link>
          )



        )}

      </nav>

    </div >
  );
}
export default memo(Sidebar)