"use client";

import { Avatar, Flex, Input } from 'antd';
import moment from 'moment';
import { useEffect, useMemo, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { BsSearch } from 'react-icons/bs';
import { useSelector } from 'react-redux';

import { useNavigate, useParams } from 'react-router-dom';
import { useGetAllChatQuery, useMarkAsReadMutation } from '../../../features/Chat/message';
import { useDebounce } from '../../../hooks/useDebounce';
import { getImageUrl } from '../../../utils/getImageUrl';

const ChatList = ({ setIsChatActive, status }) => {
  const router = useNavigate();
  const { chatRoomId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const chatListContainerRef = useRef(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  const [markAsRead, { isLoading: markAsReadLoading }] = useMarkAsReadMutation()
  const { data: chatListData, isLoading, isError, refetch } = useGetAllChatQuery(debouncedSearchTerm);

  const { chats } = useSelector((state) => state);

  // Memoize and sort the chat list to maintain consistent order
  const chatList = useMemo(() => {
    if (!chatListData?.data) return [];
    // Sort by last message time (newest first) or any other criteria you prefer
    return [...chatListData.data].sort((a, b) => {
      return new Date(b.lastMessage?.createdAt || 0) - new Date(a.lastMessage?.createdAt || 0);
    });
  }, [chatListData]);

  // Save scroll position when scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (chatListContainerRef.current) {
        setScrollPosition(chatListContainerRef.current.scrollTop);
      }
    };

    const chatListContainer = chatListContainerRef.current;
    if (chatListContainer) {
      chatListContainer.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (chatListContainer) {
        chatListContainer.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // Restore scroll position after data changes or navigation
  useEffect(() => {
    if (chatListContainerRef.current && !isLoading) {
      chatListContainerRef.current.scrollTop = scrollPosition;
    }
  }, [chatList, isLoading, scrollPosition]);

  const handleSelectChat = async (chatId) => {
    // Store current scroll position before navigation
    if (chatListContainerRef.current) {
      setScrollPosition(chatListContainerRef.current.scrollTop);
    }

    router(`/support-chat/chat/${chatId}`);
    if (setIsChatActive) {
      setIsChatActive(true);
    }

    try {
      await markAsRead(chatId).unwrap();
      refetch();
    } catch (error) {
      toast.error(error.message);
    }
  }

  const formatTime = (timestamp) => {
    if (!timestamp) return "Just now";
    const bangladeshTime = moment.utc(timestamp).utcOffset(6);
    return bangladeshTime.fromNow();
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };


  return (
    <div className="w-full h-[80vh] shadow rounded-lg flex flex-col bg-white border border-gray-200">
      <div className="p-4">
        <Flex gap={8}>
          <Input
            prefix={<BsSearch className="mx-1 text-subtitle" size={20} />}
            placeholder="Search for..."
            allowClear
            style={{ width: '100%', height: 42 }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Flex>
      </div>

      <div
        ref={chatListContainerRef}
        className="chat-list-container flex-1 overflow-y-auto px-4 scrollbar-light"
        style={{
          scrollbarWidth: 'thin',
        }}>
        <style jsx global>{`
          .chat-list-container::-webkit-scrollbar {
            width: 6px;
          }
          .chat-list-container::-webkit-scrollbar-track {
            background: #FFFFFF;
          }
          .chat-list-container::-webkit-scrollbar-thumb {
            background-color: #CBD5E0;
          }
        `}</style>
        {chatList?.length > 0 ? (
          chatList.map((chat) => (
            <div
              key={chat?._id}
              onClick={() => handleSelectChat(chat?._id)}
              className={`flex items-center gap-4 p-4 cursor-pointer rounded-lg
            ${chat?._id === chatRoomId ? 'bg-gray-200' : 'hover:bg-gray-100'}
            text-gray-800`}
            >
              <Avatar size={50} src={getImageUrl(chat?.participants?.[0]?.image)} />
              <div className="flex-1">
                <h3 className="font-medium max-w-[20ch]">
                  {chat?.participants?.[0]?.name.split(' ')[0] || "User"}
                </h3>
                <p className="text-sm truncate text-gray-600">
                  {chat?.lastMessage?.text?.slice(0, 25) || ''}
                </p>
              </div>
              <div className="text-right flex flex-col gap-2">
                <p className="text-sm text-gray-500">
                  {formatTime(chat?.lastMessage?.createdAt)}
                </p>
                {chat?.unreadCount > 0 && (
                  <span className="bg-primary text-white rounded-full px-2 py-1 text-xs">
                    {chat?.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-32">
            <p className="text-gray-500">No chats found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;