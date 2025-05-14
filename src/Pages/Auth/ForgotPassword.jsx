import { Button, Form, Input, ConfigProvider } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useForgotPasswordMutation } from "../../features/auth/authApi";
import toast from "react-hot-toast";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [ForgotPassword, { isLoading }] = useForgotPasswordMutation();


  const onFinish = async (values) => {
    try {
      const response = await ForgotPassword(values).unwrap();
      if (response.success) {
        toast.success(response.message);
        navigate(`/auth/verify-otp?email=${values?.emailOrPhone}`);
      }
    } catch (error) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-[25px] font-semibold mb-6">Forgot Password</h1>
        <p className="w-[90%] mx-auto text-base">
          Enter your email below to reset your password
        </p>
      </div>

      <ConfigProvider
        theme={{
          components: {
            Form: {
              labelColor: "black",
            },
          },
        }}
      >
        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={<p className="text-base font-normal">Email</p>}
            name="emailOrPhone"
            id="email"
            rules={[
              {
                required: true,
                message: "Please input your email!",
              },
            ]}
          >
            <Input
              placeholder="Enter your email address"
              style={{
                height: 45,
                border: "1px solid #d9d9d9",
                outline: "none",
                boxShadow: "none",
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
             loading={isLoading}
            htmlType="submit"
            type="submit"
            style={{
              width: "100%",
              height: 47,
              color: "white",
              fontWeight: "400px",
              fontSize: "18px",
              marginTop: 20,
            }}
            className="flex items-center justify-center text-base rounded-lg bg-smart hover:bg-smart/90"
            >
              Send OTP
            </Button>
          </Form.Item>
        </Form>
      </ConfigProvider>
    </div>
  );
};

export default ForgotPassword;
