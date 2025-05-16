"use client";

import { Avatar, Flex, Input, Spin } from 'antd';
import moment from 'moment';

import { useState } from 'react';
import toast from 'react-hot-toast';
import { BsSearch } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetAllChatQuery, useMarkAsReadMutation } from '../../../features/Chat/message';
import { useDebounce } from '../../../Hooks/useDebounce';
import { getImageUrl } from '../../../utils/getImageUrl';



const ChatList = ({ setIsChatActive, status }) => {

  const router = useNavigate();
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [markAsRead, { isLoading: markAsReadLoading }] = useMarkAsReadMutation()
  const { data: chatList, isLoading, isError, refetch } = useGetAllChatQuery(debouncedSearchTerm);

  const { chats } = useSelector((state) => state);

  const handleSelectChat = async (id) => {
    router(`/chat/${id}`);
    if (setIsChatActive) {
      setIsChatActive(true);
    }

    try {
      const response = await markAsRead(id).unwrap();
      console.log(response)
      refetch()
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
    <div className={`w-full h-[80vh]  shadow rounded-lg flex flex-col light-mode bg-white border-gray-200`}>

      <div className="p-4 ">
        <Flex gap={8}>
          <Input
            prefix={<BsSearch className={`text-subtitle`} size={20} />}
            placeholder="Search for..."
            allowClear
            style={{ width: '100%', height: 42 }}
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </Flex>
      </div>

      <div className={`chat-list-container flex-1 overflow-y-auto px-4 scrollbar-light`}
        style={{
          scrollbarWidth: 'thin',
        }}>

       {
        isLoading ? <div className='flex justify-center items-center h-[200px]'><Spin size="small" /></div> : (
           chatList?.data && chatList?.data?.length > 0 ? (
          chatList?.data?.map((chat) => (
            <div
              key={chat?._id}
              onClick={() => handleSelectChat(chat?._id)}
              className={`flex items-center gap-4 p-4 cursor-pointer rounded-lg
                        ${chat?._id === id
                  ? ('bg-[#EBF4FF]')
                  : ('hover:bg-[#EBF4FF]')}
                      'text-gray-800'}`}
            >
              <Avatar size={50} src={getImageUrl(chat?.participants?.[0]?.profile)} />
              <div className="flex-1">
                <h3 className="font-medium ellipsis truncate max-w-[20ch]">
                  {chat?.participants?.[0]?.userName || "User"}
                </h3>
                <p className={`text-sm truncate text-gray-600`}>
                  {chat?.lastMessage?.text?.slice(0, 25)}
                </p>
              </div>
              <div className="text-right flex flex-col gap-2">
                <p className={`text-sm text-gray-500`}>
                  {formatTime(chat?.lastMessage?.createdAt)}
                </p>

                <p className={`text-sm text-gray-500`}>
                  {chats?.unreadCount === 0 ? null : (
                    <span className="bg-primary text-white rounded-full px-2 py-1 text-xs">
                      {chats?.unreadCount}
                    </span>
                  )}
                </p>
              </div>

            </div>
          ))
        ) : (
          <div className="flex justify-center items-center h-32">
            <p className={'text-gray-500'}>No chats found</p>
          </div>
      
        )
      )}
      </div>
    </div>
  );
};

export default ChatList;
