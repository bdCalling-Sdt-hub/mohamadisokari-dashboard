'use client';

import { Avatar, Badge, Button, Dropdown, Form, Input, Tooltip, Upload } from 'antd';
import EmojiPicker from 'emoji-picker-react';
import { useEffect, useRef, useState } from 'react';
import { BsEmojiSmile } from 'react-icons/bs';
import { FiMoreVertical } from 'react-icons/fi';
import { IoIosAttach, IoMdSend } from 'react-icons/io';
import { TbTrash } from 'react-icons/tb';
import { useSelector } from 'react-redux';
import { useDeleteMessageMutation, useGetAllChatQuery, useGetAllMassageQuery, useMessageSendMutation, useReactMessageMutation } from '../../../features/Chat/message';
import { getImageUrl } from '../../../utils/getImageUrl';

const ChatWindow = ({ id }) => {


  useGetAllMassageQuery(id);
  const { messages } = useSelector((state) => state.message);


  const [sendMessage, { isLoading: sendLoading }] = useMessageSendMutation();
  const [messageReact, { isLoading: reactLoading }] = useReactMessageMutation();
  const [DeleteMessage, { isLoading: deleteLoading }] = useDeleteMessageMutation();
  const loginUserId = localStorage.getItem("userId");
  const [form] = Form.useForm();
  const messagesEndRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null);
  const { data: chatList, isLoading: chatLoading } = useGetAllChatQuery("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showReactionPicker, setShowReactionPicker] = useState({ messageId: null, show: false });
  const inputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const reactionPickerRef = useRef(null);

  const users = chatList?.data?.find(chat => chat?.participants?.map(item => item === id));

  // The available reactions
  const reactions = [
    { emoji: '❤️', name: 'love' },
    { emoji: '👍', name: 'thumbs_up' },
    { emoji: '😂', name: 'laugh' },
    { emoji: '😡', name: 'angry' },
    { emoji: '😢', name: 'sad' }
  ];

  // Handle outside click for emoji picker
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }

      if (
        showReactionPicker.show &&
        reactionPickerRef.current &&
        !reactionPickerRef.current.contains(event.target)
      ) {
        setShowReactionPicker({ messageId: null, show: false });
      }
    }

    // Add event listener when emoji picker is shown
    if (showEmojiPicker || showReactionPicker.show) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Clean up the event listener
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showEmojiPicker, showReactionPicker]);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleCreateNewMessage = async (values) => {
    if (!values.message && (!values?.file?.fileList || values?.file?.fileList.length === 0)) {
      return; // Don't send empty messages
    }

    const formData = new FormData();

    if (values?.file?.fileList?.length > 0) {
      formData.append("image", values?.file?.fileList[0]?.originFileObj);
    }

    formData.append("data", JSON.stringify({ text: values.message }));

    try {
      const res = await sendMessage({ body: formData, id }).unwrap();
      // Reset form and image preview
      form.resetFields();
      setImagePreview(null);
      setShowEmojiPicker(false);
    } catch (error) {
      console.error(error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    });
  };

  const handleFileChange = ({ fileList }) => {
    if (fileList.length > 0) {
      const file = fileList[0].originFileObj;
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }

    // Update the form
    form.setFieldsValue({ file: { fileList } });
  };

  const removeImage = () => {
    setImagePreview(null);
    form.setFieldsValue({ file: { fileList: [] } });
  };

  const onEmojiClick = (emojiData) => {
    const currentMessage = form.getFieldValue('message') || '';
    form.setFieldsValue({ message: currentMessage + emojiData.emoji });
    inputRef.current.focus();
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  // Function to handle message deletion
  const handleUnsendMessage = async (messageId) => {
    try {
      const response = await DeleteMessage(messageId).unwrap();
    } catch (error) {
      console.error("Failed to unsend message:", error);
    }
  };

  // Function to handle adding reactions
  const handleAddReaction = async (messageId, reaction) => {
    try {
      const response = await messageReact({ messageId, reaction }).unwrap();
      // Close the reaction picker after selecting a reaction
      setShowReactionPicker({ messageId: null, show: false });
    } catch (error) {
      console.error("Failed to add reaction:", error);
    }
  };

  // Function to toggle reaction picker
  const toggleReactionPicker = (messageId) => {
    setShowReactionPicker(prev =>
      prev.messageId === messageId && prev.show
        ? { messageId: null, show: false }
        : { messageId, show: true }
    );
  };

  return (
    <div className={`flex flex-col h-[80vh] `}>
      {/* Header */}
      <div className={`p-4 flex items-center gap-4 border-b bg-white border-gray-200}`}>
        {users?.participants?.map((participantId, index) => (
          <div key={participantId} className="relative">
            <Avatar
              src={getImageUrl(participantId?.image)}
              size={40}
            />
            <Badge
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '6px',
                position: 'absolute',
                bottom: "5px",
                right: "-3px"
              }}
              dot
              color="green"
            />
          </div>
        ))}

        <h3 className={`font-medium `}>
          {users?.participants?.length > 0
            ? users.participants.map(participantId => <h3>{participantId?.name}</h3>)
            : "Chat Participants"
          }
        </h3>
      </div>

      {/* Message container */}
      <div className={`flex-1 p-4 overflow-y-auto message-container bg-[#f9f9f9]`}>
        <style jsx global>{`
          .message-container::-webkit-scrollbar {
            width: 6px;
          }
          .message-container::-webkit-scrollbar-track {
            background: '#F5F5F6';
          }
          .message-container::-webkit-scrollbar-thumb {
            background-color:  '#CBD5E0';
          }
          .message-bubble {
            position: relative;
            transition: all 0.2s ease;
          }
          .message-options {
            opacity: 0;
            transition: opacity 0.2s ease;
          }
          .message-wrapper:hover .message-options {
            opacity: 1;
          }
          .deleted-message {
            background-color:  '#f0f0f0' !important;
            font-style: italic;
          }
        `}</style>

        {messages?.slice().reverse().map((message, index) => {
          const isCurrentUser = message.sender?._id === loginUserId;
          const isDeleted = message.isDeleted === true;

          return (
            <div key={message._id || index} className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} mb-6 message-wrapper`}>
              {!isCurrentUser && (
                <Avatar
                  src={getImageUrl(message.sender?.profile)}
                  size={32}
                  className="mr-2 self-start mt-1"
                />
              )}

              <div className="relative group ">
                <div className={`message-bubble max-w-xs p-3 rounded-2xl ${isDeleted
                  ? 'deleted-message'
                  : isCurrentUser
                    ? 'bg-[#f2f2f2] text-black'
                    :
                    'bg-white text-gray-800'
                  } shadow-sm`}>
                  <p className={`${isDeleted ? "text-red-500" : ""}`}>{message.text}</p>

                  {message.image && !isDeleted && (
                    <img
                      src={getImageUrl(message.image)}
                      alt="Message attachment"
                      className="rounded-lg w-44 my-2 h-44 object-cover"
                    />
                  )}

                  <p className={`text-xs mt-1 opacity-70`}>
                    {formatDate(message.createdAt)}
                  </p>

                  {/* Display reactions if any and message is not deleted */}
                  {!isDeleted && message.reactions && message.reactions.length > 0 && (
                    <div className="flex gap-1 absolute -mb-3 -ml-3">
                      <div className={`flex items-center px-1.5 py-0.5 rounded-full bg-gray-100 shadow-sm`}>
                        {message.reactions.map((reaction, i) => (
                          <Tooltip key={i} title={`${reaction?.userId?.name}`}>
                            <span className="text-sm">
                              {reaction.reactionType === "love" && "❤️"}
                              {reaction.reactionType === "thumbs_up" && "👍"}
                              {reaction.reactionType === "laugh" && "😂"}
                              {reaction.reactionType === "angry" && "😡"}
                              {reaction.reactionType === "sad" && "😢"}
                            </span>
                          </Tooltip>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Action buttons that appear on hover - only show if message is NOT deleted */}
                {!isDeleted && (
                  <div className={`message-options absolute ${isCurrentUser ? 'left-0 top-1/2 -translate-x-full -translate-y-1/2' : 'right-0 top-1/2 translate-x-full -translate-y-1/2'} flex`}>
                    {/* Reaction button */}
                    <Button
                      type="text"
                      size="small"
                      icon={<BsEmojiSmile />}
                      className={`flex items-center justify-center p-1 rounded-full text-gray-600 bg-white hover:bg-gray-100 shadow-sm`}
                      onClick={() => toggleReactionPicker(message._id)}
                      loading={reactLoading}
                    />

                    {/* 3-dot menu button - for current user's messages */}
                    {isCurrentUser && (
                      <Dropdown
                        menu={{
                          items: [
                            {
                              key: '1',
                              label: deleteLoading ? 'Deleting...' : 'Unsend Message',
                              icon: <TbTrash size={14} />,
                              onClick: () => handleUnsendMessage(message._id),
                              danger: true,
                              disabled: deleteLoading
                            }
                          ]
                        }}
                        trigger={['click']}
                        placement="bottomRight"
                      >
                        <Button
                          type="text"
                          size="small"
                          icon={<FiMoreVertical />}
                          className={`ml-1 flex items-center justify-center p-1 rounded-full text-gray-600 bg-white hover:bg-gray-100'} shadow-sm`}
                        />
                      </Dropdown>
                    )}
                  </div>
                )}

                {/* Reaction picker - only show if message is NOT deleted */}
                {!isDeleted && showReactionPicker.show && showReactionPicker.messageId === message._id && (
                  <div
                    ref={reactionPickerRef}
                    className={`absolute z-10 p-1 mt-3 rounded-full shadow-md flex gap-1 bg-white border border-gray-200 ${isCurrentUser ? 'right-0' : 'left-0'} -top-8`}
                  >
                    {reactions.map((reaction) => (
                      <Button
                        key={reaction.name}
                        type="text"
                        size="small"
                        className="p-1 hover:bg-gray-100 rounded-full"
                        onClick={() => handleAddReaction(message._id, reaction.name)}
                      >
                        {reaction.emoji}
                      </Button>
                    ))}
                  </div>
                )}
              </div>

              {isCurrentUser && (
                <Avatar
                  src={getImageUrl(message.sender?.profile)}
                  size={32}
                  className="ml-2 self-start mt-1"
                />
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <div className={`p-1 border-t bg-white border-gray-200`}>
        {/* Image preview area */}
        {imagePreview && (
          <div className="mx-4 mt-2 relative">
            <div className="relative inline-block">
              <img
                src={imagePreview}
                alt="Preview"
                className={`h-20 w-auto rounded object-cover border border-gray-200`}
              />
              <Button
                type="text"
                className={`absolute top-1 right-1 rounded-full p-0 flex items-center justify-center h-6 w-6 shadow-md bg-white text-gray-800`}
                onClick={removeImage}
                style={{ fontSize: '12px' }}
              >
                ✕
              </Button>
            </div>
          </div>
        )}

        <Form
          form={form}
          onFinish={handleCreateNewMessage}
          name="messageForm"
          className="flex w-full items-center px-2 py-1 gap-2 relative"
        >
          <div className="flex items-center">
            <Form.Item name="file" valuePropName="file" className="mb-0 mr-1">
              <Upload
                beforeUpload={() => false}
                accept="image/*"
                maxCount={1}
                showUploadList={false}
                onChange={handleFileChange}
              >
                <Button
                  type="text"
                  icon={<IoIosAttach color={"#9F9F9F"} size={24} />}
                  className="flex items-center justify-center"
                />
              </Upload>
            </Form.Item>

            <Form.Item className="mb-0 mr-1">
              <Button
                ref={emojiButtonRef}
                type="text"
                icon={<BsEmojiSmile color={"#9F9F9F"} size={20} />}
                onClick={toggleEmojiPicker}
              />
            </Form.Item>
          </div>

          {showEmojiPicker && (
            <div className="absolute bottom-16 left-16 z-10" ref={emojiPickerRef}>
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                width={300}
                height={350}
                theme={'light'}
              />
            </div>
          )}

          <Form.Item name="message" className="flex-1 mb-0">
            <Input
              ref={inputRef}
              style={{
                backgroundColor: '#F5F5F6',
                borderRadius: '20px',
                color: 'inherit',
                padding: '8px 16px'
              }}
              placeholder="Type something ..."
              size="large"
            />
          </Form.Item>

          <Form.Item className="mb-0 ml-1">
            <Button
              htmlType="submit"
              type="primary"
              icon={<IoMdSend />}
              shape="circle"
              size="large"
              style={{
                backgroundColor: '#0047FF',
                border: 'none',
              }}
              loading={sendLoading}
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ChatWindow;