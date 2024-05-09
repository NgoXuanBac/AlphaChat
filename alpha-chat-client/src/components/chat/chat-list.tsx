import { Message } from "@/app/data";
import { cn } from "@/lib/utils";
import React, { memo, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import ChatBottombar from "./chat-bottombar";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Dialog, DialogBody, DialogFooter, DialogHeader, Select, Spinner } from "@material-tailwind/react";
import chatService from "@/services/chatService";
import { useChat } from "@/hooks/useChat";
import { useSocket } from "@/hooks/useSocket";
import { useAuth } from "@/hooks/useAuth";
import { Trash } from 'lucide-react';
import Link from "next/link";
import { buttonVariants } from "../ui/button";
import _ from "lodash";
interface ChatListProps {
  isMobile: boolean;
}
const ChatList = ({
  isMobile
}: ChatListProps) => {
  const { selectedChat, chats, setChats } = useChat()
  const { user } = useAuth()
  const { websocket } = useSocket()

  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(-1)

  const [deleteMessageId, setDeleteMessageId] = useState(-1)

  const [open, setOpen] = React.useState(false)
  const handleOpen = () => setOpen(!open)


  useEffect(() => {
    const onMessageReceived = (response: any) => {
      setMessages(pre => [...pre, response.message])
    }
    const onMessageUpdated = (response: any) => {
      setMessages(messages => messages.map(m => {
        return (m.id === response.message.id) ? response.message : m;
      }))
    }
    if (!websocket || !user || !selectedChat) return
    const subRe = websocket.subscribe(`/user/${user.id}/${selectedChat.id}/private`, onMessageReceived)
    const subUp = websocket.subscribe(`/user/${user.id}/${selectedChat.id}/private-update`, onMessageUpdated)

    return () => {
      subRe?.unsubscribe()
      subUp?.unsubscribe()

    }
  }, [user, websocket, selectedChat])

  useEffect(() => {
    if (selectedChat === undefined) return

    const loadChatMessages = async () => {
      try {
        var response = await chatService.getMessages(selectedChat.id)
        setMessages(response.data)

        setLoading(false);
      } catch (error) {
        console.log(error)
      }
    }
    loadChatMessages()
    return () => {
      setMessages([])
      setLoading(true);
    }
  }, [selectedChat])


  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);




  const sendMessage = (newMessage: Message) => {
    if (!selectedChat || !user) return;
    (async () => {
      try {
        const request = { recipientId: selectedChat.id, message: newMessage }
        const response = await chatService.sendMessages(request)
        request.message = response.data;
        if (websocket) websocket.send('/app/private-message', request)
        setMessages([...messages, response.data])


        let chat = selectedChat;
        const chatIndex = _.findIndex(chats, { id: selectedChat.id });
        if (chatIndex === -1) chat = (await chatService.makeChats(selectedChat.id)).data
        else chats.splice(chatIndex, 1)
        chat.lastMessage = (newMessage.sender.id == user.id ? "You: " : "") + newMessage.content;
        setChats(chats => [chat, ...chats])

      } catch (error) {
        console.log(error);
      }
    })()
  }

  const handleRemove = async () => {
    if (!selectedChat) return;
    let deleteMessage: any = null;
    const updatedMessages = messages.map(message => {
      if (message.id === deleteMessageId) {
        deleteMessage = message;
        deleteMessage.deleted = true;
        return deleteMessage;
      }
      return message;
    });

    try {
      const request = { recipientId: selectedChat.id, message: deleteMessage }
      if (websocket) websocket.send('/app/private-message-update', request)
      await chatService.removeMessage(deleteMessageId);
    } catch (error) {
      console.log(error);
    }
    setMessages(updatedMessages);
    handleOpen();

    setDeleteMessageId(-1);
  }

  return (
    <>
      <Dialog open={open} handler={handleOpen} placeholder={undefined} className="bg-[#fdfdfd] w-full rounded">
        <DialogHeader placeholder={undefined} className="font-normal">Delete Message</DialogHeader>
        <DialogBody placeholder={undefined} className="text-gray-600">
          You want to delete this message permanently
        </DialogBody>
        <DialogFooter placeholder={undefined}>
          <Button
            variant="text"
            color="red"
            onClick={handleOpen}
            className="mr-1 rounded"
            placeholder={undefined}
          >
            <span>Cancel</span>
          </Button>
          <Button
            color="black"
            className="rounded"
            onClick={handleRemove}
            placeholder={undefined}
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog >

      {
        selectedChat ? (
          <div className="w-full overflow-y-auto overflow-x-hidden h-full flex flex-col scrollbar-thin " >
            {
              loading ? (
                <div className="flex justify-center items-center w-full h-full" >
                  <Spinner />
                </div >
              ) : (
                <div
                  ref={messagesContainerRef}
                  className="w-full overflow-y-scroll overflow-x-hidden h-full flex flex-col"
                >
                  <AnimatePresence>
                    {messages?.map((message, index) => (
                      <motion.div
                        key={index}
                        layout
                        initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
                        animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                        exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
                        transition={{
                          opacity: { duration: 0.1 },
                          layout: {
                            type: "spring",
                            bounce: 0.3,
                            duration: messages.indexOf(message) * 0.05 + 0.2,
                          },
                        }}
                        style={{
                          originX: 0.5,
                          originY: 0.5,
                        }}
                        className={cn(
                          "flex flex-col gap-2 p-4 whitespace-pre-wrap",
                          message.sender.id !== selectedChat.id ? "items-end" : "items-start"
                        )}
                      >
                        <div className="flex gap-3 items-center">
                          {message.sender.id === selectedChat.id && (

                            <Avatar className="flex justify-center items-center">
                              <AvatarImage
                                src={message.sender.avatar}
                                alt={message.sender.name}
                                width={6}
                                height={6}
                              />
                            </Avatar>
                          )}
                          {message.deleted ? (
                            <span className="bg-accent p-3 rounded-md max-w-xs text-gray-500 italic text-xs">
                              The message was deleted
                            </span>
                          ) : (
                            <div className={cn("flex items-center gap-x-1",
                              message.sender.id !== selectedChat.id ? "pl-4" : "pr-4"
                            )}
                              onMouseEnter={() => { setIsHovered(index); setDeleteMessageId(message.id!); }}
                              onMouseLeave={() => setIsHovered(-1)}
                            >
                              {message.sender.id !== selectedChat.id && isHovered === index &&
                                <Link
                                  href="#"
                                  className={cn(
                                    buttonVariants({ variant: "ghost", size: "icon" }),
                                    "h-9 w-9",
                                    "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                                  )}
                                  onClick={handleOpen}
                                >
                                  <Trash color="#757575" size={14} />
                                </Link>
                              }
                              <span className=" bg-accent p-3 rounded-md max-w-xs"

                              >
                                {message.content}
                              </span>
                            </div>

                          )}

                          {message.sender.id !== selectedChat.id && (
                            <Avatar className="flex justify-center items-center">
                              <AvatarImage
                                src={message.sender.avatar}
                                alt={message.sender.name}
                                width={6}
                                height={6}
                              />
                            </Avatar>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div >
              )
            }

            <ChatBottombar sendMessage={sendMessage} isMobile={isMobile} />
          </div >
        ) : (
          <div className="w-full h-full flex flex-col justify-center items-center">
            <p>Welcome to Alpha Chat</p>
          </div>
        )
      }
    </>

  );
}

export default memo(ChatList)