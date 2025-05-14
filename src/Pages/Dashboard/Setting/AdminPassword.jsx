import React from "react";
import { Form, Input, Card, Flex, ConfigProvider, message } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import ButtonEDU from "../../../components/common/ButtonEDU";
import { useChangePasswordMutation } from "../../../features/createAdmin/CreateAdmin";
import toast from "react-hot-toast";

function AdminPassword() {
  const [form] = Form.useForm(); // Form instance
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  // Handle cancel: Reset form fields
  const handleCancel = () => {
    form.resetFields();
    message.info("Password change cancelled.");
  };

  // Handle save: Validate, trim, and submit form
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const trimmedValues = {
        currentPassword: values.currentPassword.trim(),
        newPassword: values.newPassword.trim(),
        confirmPassword: values.confirmPassword.trim(),
      };

      // Connect to API to update the password
      const result = await changePassword(trimmedValues).unwrap();
      
      // Show success message and reset form
      toast.success("Password updated successfully!");
      form.resetFields();
    } catch (error) {
      // Handle API errors
      if (error.status === 401) {
        toast.error("Current password is incorrect");
      } else if (error.data?.message) {
        toast.error(error.data.message);
      } else {
        toast.error("Failed to update password. Please try again later.");
      }
      console.error("Password update failed:", error);
    }
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#F97316',
        },
        components: {
          Card: {
            headerBg: "#F97316",
            headerHeight: "30px",
            headerPadding: "5px",
          },
        },
      }}
    >
      <Card
        title="Change Password"
        bordered={false}
        className="w-2/5 h-full flex flex-col text-white shadow-[0px_10px_100px_3px_rgba(0,_0,_0,_0.1)]"
      >
        <ConfigProvider
          theme={{
            components: {
              Form: {
                labelFontSize: 16,
              },
            },
          }}
        >
          <Form
            form={form}
            layout="vertical"
            className="flex flex-col items-center h-auto justify-evenly"
          >
            {/* Current Password */}
            <Form.Item
              label="Current Password"
              name="currentPassword"
              rules={[
                {
                  required: true,
                  message: "Please enter your current password!",
                },
              ]}
              className="w-[80%]"
            >
              <Input.Password
                placeholder="Enter current password"
                className="h-10"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            {/* New Password */}
            <Form.Item
              label="New Password"
              name="newPassword"
              rules={[
                { required: true, message: "Please enter a new password!" },
                {
                  min: 6,
                  message: "Password must be at least 6 characters long!",
                },
              ]}
              className="w-[80%]"
            >
              <Input.Password
                placeholder="Enter new password"
                className="h-10"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            {/* Confirm New Password */}
            <Form.Item
              label="Confirm New Password"
              name="confirmPassword"
              dependencies={["newPassword"]}
              rules={[
                {
                  required: true,
                  message: "Please confirm your new password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("newPassword") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
              className="w-[80%]"
            >
              <Input.Password
                placeholder="Confirm new password"
                className="h-10"
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>

            {/* Buttons: Cancel & Save */}
            <Flex justify="flex-end" className="w-[80%] gap-4">
              <ButtonEDU actionType="cancel" onClick={handleCancel} disabled={isLoading}>
                Cancel
              </ButtonEDU>
              <ButtonEDU actionType="save" onClick={handleSave} loading={isLoading}>
                Save
              </ButtonEDU>
            </Flex>
          </Form>
        </ConfigProvider>
      </Card>
    </ConfigProvider>
  );
}

export default AdminPassword;