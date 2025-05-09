import { Button, ConfigProvider, Form, Input, Typography } from "antd";
import React from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { useResetPasswordMutation } from "../../features/auth/authApi";

const { Title, Text } = Typography;

const ResetPassword = () => {
  const location = useLocation();
  const token = new URLSearchParams(location.search).get("verifyToken");
  const navigate = useNavigate();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const onFinish = async (values) => {
    try {
      // Include the token in the request body
      const response = await resetPassword({
        token,
        newPassword: values.newPassword,
        confirmPassword: values.confirmPassword
      }).unwrap();

      if (response.success) {
        toast.success(response.message);
        navigate("/auth/login");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Password reset failed");
    }
  };

  return (
    <div className="max-w-md p-8 mx-auto overflow-hidden bg-white rounded-xl md:max-w-2xl">
      <div className="mb-10 text-center">
        <Title level={3} className="!text-2xl !font-semibold !mb-2 !text-gray-800">
          Reset Password
        </Title>
        <Text type="secondary" className="text-gray-500">
          Create a new password for your account
        </Text>
      </div>

      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#FF6600',
            borderRadius: 8,
            colorBgContainer: '#ffffff',
          },
          components: {
            Form: {
              labelColor: "black",
            },
            Input: {
              hoverBorderColor: '#FF6600',
              activeBorderColor: '#FF6600',
            }
          },
        }}
      >
        <Form layout="vertical" onFinish={onFinish} className="space-y-6">
          <Form.Item
            name="newPassword"
            label={
              <Text className="!text-gray-700 !font-medium">
                New Password
              </Text>
            }
            rules={[
              {
                required: true,
                message: "Please input your new Password!",
              },
              {
                min: 8,
                message: "Password must be at least 8 characters!",
              },
            ]}
          >
            <Input.Password
              placeholder="Enter new password"
              className="!h-12 !rounded-lg hover:!border-orange-300 focus:!border-orange-500 focus:!shadow-md"
            />
          </Form.Item>

          <Form.Item
            label={
              <Text className="!text-gray-700 !font-medium">
                Confirm Password
              </Text>
            }
            name="confirmPassword"
            dependencies={["newPassword"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The passwords you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              placeholder="Confirm your password"
              className="!h-12 !rounded-lg hover:!border-orange-300 focus:!border-orange-500 focus:!shadow-md"
            />
          </Form.Item>

          <Form.Item>
            <Button
              loading={isLoading}
              type="primary"
              htmlType="submit"
              block
              className="!h-12 !rounded-lg !text-white !font-medium !text-base !bg-orange-500 hover:!bg-orange-600 focus:!bg-orange-600 !border-orange-500 !shadow-md"
            >
              Update Password
            </Button>
          </Form.Item>
        </Form>
      </ConfigProvider>
    </div>
  );
};

export default ResetPassword;