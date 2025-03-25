import React, { useState } from "react";
import { Button, Dropdown, Form, Input, Menu, ConfigProvider } from "antd";
import { IoMdArrowDropdown } from "react-icons/io";
import { FaRegPaperPlane } from "react-icons/fa6";
// import purle from "../../../assets/gtdandy/purple.jpg";
function PushNotification() {
  const [form] = Form.useForm();
  const [selectedRecipient, setSelectedRecipient] = useState("All Users");

  // Dropdown menu items
  const items = [
    {
      label: "All Users",
      key: "0",
    },
    {
      label: "Customers Only",
      key: "1",
    },
    {
      label: "Service Providers Only",
      key: "2",
    },
  ];

  // Handle dropdown selection
  const handleMenuClick = (e) => {
    const selected = items.find((item) => item.key === e.key);
    if (selected) {
      setSelectedRecipient(selected.label);
    }
  };

  // Handle form submission
  const onFinish = (values) => {
    console.log("Form Values:", {
      ...values,
      recipient: selectedRecipient,
    });
  };

  return (
    <>
      <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#F97316',
            },
          }}
        >
      <div className="max-w-lg p-10 mx-auto bg-white rounded-md shadow-md">
        <h1 className="text-[24px] font-semibold mb-4 border-b-2">
          Send Push Notification
        </h1>
        <ConfigProvider
          theme={{
            components: {
              Form: {
                labelFontSize: 16,
              },
            },
          }}
        >
          <Form form={form} layout="vertical" onFinish={onFinish}>
            {/* Title */}
            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "Title is required" }]}
            >
              <Input
                placeholder="Enter notification title..."
                className="h-11"
              />
            </Form.Item>

            {/* Message Details */}
            <Form.Item
              label="Message Details"
              name="message"
              rules={[{ required: true, message: "Message is required" }]}
            >
              <Input.TextArea
                rows={4}
                placeholder="Enter notification message..."
              />
            </Form.Item>

            
            {/* Submit Button */}
            <Form.Item>
              <Button
                type="block"
                htmlType="submit"
                className="w-full gap-4 text-base text-white bg-smart hover:bg-smart/90 h-11"
              >
                Send Notification
                <FaRegPaperPlane />
              </Button>
            </Form.Item>
          </Form>
        </ConfigProvider>
      </div>
      </ConfigProvider>
    </>
  );
}

export default PushNotification;
