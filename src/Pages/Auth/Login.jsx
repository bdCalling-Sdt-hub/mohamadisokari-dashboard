import { Button, Checkbox, Form, Input } from "antd";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../features/auth/authApi";
import { saveToken } from "../../features/auth/authService";


const Login = () => {
  const navigate = useNavigate();
  const [Login, { isLoading }] = useLoginMutation();



  const onFinish = async (values) => {
    try {
      const response = await Login(values).unwrap();
      if (response.success) {
        saveToken(response?.data?.accessToken);
        localStorage.setItem("userId", response?.data?.userId);

        // Decode the token to get the role
        const decodedToken = jwtDecode(response?.data?.accessToken); // Changed here too
        const role = decodedToken?.role; // Extract role from token

        // Redirect based on role
        if (role === "SUPER_ADMIN") {
          navigate("/"); // Redirect SUPER_ADMIN to a specific route
        } else if (role === "USER") {
          toast.error("You have no permission to login");
        } else {
          toast.success(response.message);
        }

      }
    } catch (error) {
      toast.error(error?.data?.message ? error?.data?.message : "Login failed something server error");
    }
  };

  return (
    <div>
      <div className="mb-8 text-center">
        <h1 className="text-[25px] font-semibold mb-6">Login</h1>
        <p>Please enter your email and password to continue</p>
      </div>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item
          name="emailOrPhone"
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
            // name="remember"
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
            Sign in
          </Button>
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