import { Button, Checkbox, Form, Input } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import FormItem from "../../components/common/FormItem";

const Login = () => {
  const navigate = useNavigate();

  const onFinish = async (values) => {
    navigate("/");
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-[25px] font-semibold mb-6">Login</h1>
        <p>Please enter your email and password to continue</p>
      </div>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item
          name="email"
          label={
            <p className="text-base font-normal text-black">Enter Your Email</p>
          }
          rules={[
            {
              required: true,
              message: `Please Enter your email`,
            },
          ]}
        >
          <Input
            placeholder={`Enter Your email`}
            style={{
              height: 45,
              border: "1px solid #d9d9d9",
              outline: "none",
              boxShadow: "none",
            }}
          />
        </Form.Item>

        <Form.Item
          name="password"
          label={<p className="text-base font-normal text-black">Password</p>}
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input.Password
            type="password"
            placeholder="Enter your password"
            style={{
              height: 45,
              border: "1px solid #d9d9d9",
              outline: "none",
              boxShadow: "none",
            }}
          />
        </Form.Item>

        <div className="flex items-center justify-between">
          <Form.Item
            style={{ marginBottom: 0 }}
            name="remember"
            valuePropName="checked"
          >
            <Checkbox 
              className="custom-checkbox"
            >
              Remember me
            </Checkbox>
          </Form.Item>

          <a
            className="font-semibold login-form-forgot text-smart/80 hover:text-smart"
            href="/auth/forgot-password"
          >
            Forgot password
          </a>
        </div>

        <Form.Item style={{ marginBottom: 0 }}>
          <button
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
            Sign in
          </button>
        </Form.Item>
      </Form>
      
      <style jsx>{`
        .custom-checkbox .ant-checkbox-checked .ant-checkbox-inner {
          background-color: #FF7527 !important;
          border-color: #FF7527 !important;
        }
        .custom-checkbox .ant-checkbox-checked::after {
          border-color: #FF7527 !important;
        }
          .custom-checkbox:hover .ant-checkbox-checked::after {
          border-color: #FF7527 !important;
        }
      `}</style>
    </div>
  );
};

export default Login;