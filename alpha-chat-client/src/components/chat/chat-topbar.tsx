import React from 'react'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Info, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useChat } from '@/hooks/useChat';
import chatService from '@/services/chatService';
import _ from 'lodash';



export default function ChatTopbar() {

  const { selectedChat, chats, setChats, setSelectedChat } = useChat()

  const handleRemove = async (id: number) => {
    if (!selectedChat) return;
    await chatService.removeChat(id);
    const chatIndex = _.findIndex(chats, { id: selectedChat.id });
    chats.splice(chatIndex, 1)
    setChats(chats);
    setSelectedChat(chats.length > 0 ? chats[0] : undefined);
  }


  return (
    <>
      {selectedChat && (
        <div className="w-full h-20 flex p-4 justify-between items-center border-b">
          <div className="flex items-center gap-2">
            <Avatar className="flex justify-center items-center">
              <AvatarImage
                src={selectedChat.avatar}
                alt={selectedChat.name}
                width={6}
                height={6}
                className="w-10 h-10 "
              />
            </Avatar>
            <div className="flex flex-col">
              <span className="font-medium">{selectedChat.name}</span>
            </div>
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
                  <Info size={20} className="text-muted-foreground" />
                </Link>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                className="w-full p-2 shadow-sm border rounded"
              >
                <div className="flex flex-col">
                  <Link
                    href="#"
                    className={cn(
                      buttonVariants({ variant: "ghost", size: "icon" }),
                      "h-9 w-full flex justify-start gap-x-2",
                      "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white shrink-0"
                    )}
                    onClick={() => handleRemove(selectedChat.id)}
                  >
                    <Trash2 size={16} className="text-muted-foreground" /> <span className="text-xs">Remove Chat</span>
                  </Link>

                </div>
              </PopoverContent>
            </Popover>

          </div>
        </div>
      )
      }
    </>


  )
}
