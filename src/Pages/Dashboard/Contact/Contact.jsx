import { Button, ConfigProvider, Flex, Form, Input, message, Modal, Skeleton } from "antd";
import { useState, useEffect } from "react";
import { CiMail } from "react-icons/ci";
import { LiaPhoneVolumeSolid } from "react-icons/lia";
import { useContactMutation, useGetContactQuery } from "../../../features/cms/cmsApi";

const Contact = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [contactInfo, setContactInfo] = useState({
    phone: "",
    email: "",
  });

  const [editedContact, setEditedContact] = useState({ ...contactInfo });
  const [contact, { isLoading }] = useContactMutation();
  const { data, isLoading: contactLoading } = useGetContactQuery();

  useEffect(() => {
    if (data?.data) {
      setContactInfo({
        phone: data.data.phone,
        email: data.data.email,
      });
    }
  }, [data]);

  const showModal = () => {
    setEditedContact({ ...contactInfo });
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleUpdate = async () => {
    try {
      // Trim everything after the domain part (e.g., ".com", ".org")
      const trimmedEmail = editedContact.email.replace(
        /(\.com|\.org|\.net|\.edu)(.*)$/,
        "$1"
      );

      // Prepare the data to send
      const contactData = {
        ...editedContact,
        email: trimmedEmail
      };

      // Call the API mutation
      const result = await contact(contactData).unwrap();

      // Update the local state only if API call is successful
      setContactInfo(contactData);
      setIsModalOpen(false);

      // Show success message
      message.success("Contact information updated successfully");

    } catch (error) {
      // Show error message
      message.error("Failed to update contact information");
      console.error("Failed to update contact:", error);
    }
  };

  const handleChange = (key, value) => {
    setEditedContact((prev) => ({ ...prev, [key]: value }));
  };

  const contactFields = [
    { key: "phone", label: "Phone Number", type: "text" },
    { key: "email", label: "Email", type: "text" },
  ];

  if (contactLoading) {
    return (
      <div className="py-5">
        <h1 className="text-[20px] font-medium mb-5">Contact</h1>
        <Flex vertical justify="center" gap={30} className="w-full">
          <div className="flex items-center w-4/5 gap-4 p-12 bg-white justify-normal rounded-xl">
            {[1, 2].map((item) => (
              <Flex vertical key={item} gap={20} align="center" className="flex-auto">
                <Skeleton.Avatar active size={50} shape="square" />
                <div className="flex flex-col items-center w-full">
                  <Skeleton.Input active size="small" block />
                  <Skeleton.Input active size="small" block style={{ marginTop: '10px' }} />
                </div>
              </Flex>
            ))}
          </div>
          <Skeleton.Button active block className="w-4/5 h-12" />
        </Flex>
      </div>
    );
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#F97316',
        },
      }}
    >
      <div className="py-5">
        <h1 className="text-[20px] font-medium mb-5">Contact</h1>
        <Flex vertical justify="center" gap={30} className="w-full">
          <div className="flex items-center w-4/5 gap-4 p-12 bg-white justify-normal rounded-xl ">
            {[
              {
                icon: <LiaPhoneVolumeSolid size={50} />,
                title: "Phone",
                details: contactInfo.phone || "Not available",
              },
              {
                icon: <CiMail size={50} />,
                title: "Email",
                details: contactInfo.email || "Not available",
              },
            ].map((item, index) => (
              <Flex
                vertical
                key={index}
                gap={20}
                align="center"
                className="flex-auto"
              >
                <div className="bg-white rounded-xl shadow-[0px_0px_15px_4px_rgba(0,_0,_0,_0.1)] p-4 hover:bg-smart text-smart hover:text-white">
                  {item.icon}
                </div>
                <div className="flex flex-col items-center">
                  <h2 className="text-xl font-semibold">{item.title}</h2>
                  <p className="text-gray-600">{item.details}</p>
                </div>
              </Flex>
            ))}
          </div>
          <button
            onClick={showModal}
            className="w-4/5 h-12 font-bold tracking-wider duration-500 bg-white border rounded-lg border-1 border-smart text-smart hover:bg-smart hover:text-white hover:transition-all"
          >
            Edit Info
          </button>
        </Flex>

        {/* Edit Contact Modal */}
        <Modal
          title="Edit Contact"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={false}
          centered
        >
          <div className="py-5">
            <Form
              layout="vertical"
              onFinish={handleUpdate}
              initialValues={editedContact}
            >
              {contactFields.map((field, i) => (
                <Form.Item
                  key={i}
                  label={field.label}
                  name={field.key}
                  rules={[
                    {
                      required: true,
                      message: `Please enter the ${field.label.toLowerCase()}`,
                    },
                    field.key === "email" && {
                      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      message:
                        "Please enter a valid email address (e.g. test@example.com)",
                    },
                  ].filter(Boolean)}
                >
                  <Input
                    type={field.type}
                    placeholder={`Enter your ${field.label.toLowerCase()}`}
                    className="h-12 rounded-xl"
                    value={editedContact[field.key]}
                    onChange={(e) => handleChange(field.key, e.target.value)}
                  />
                </Form.Item>
              ))}

              <div className="flex justify-end gap-4">
                <Button onClick={handleCancel}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isLoading}
                >
                  Update
                </Button>
              </div>
            </Form>
          </div>
        </Modal>
      </div>
    </ConfigProvider>
  );
};

export default Contact;