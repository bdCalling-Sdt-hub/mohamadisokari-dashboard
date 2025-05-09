import { Button, Form, Typography, message } from "antd";
import React, { useEffect, useState } from "react";
import OTPInput from "react-otp-input";
import { useLocation, useNavigate } from "react-router-dom";
import { useResendEmailMutation, useVerifyEmailMutation } from "../../features/auth/authApi";

const { Text } = Typography;

const VerifyOtp = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState("");
  const email = new URLSearchParams(location.search).get("email");
  const [OTPVerify, { isLoading }] = useVerifyEmailMutation();
  const [ResendEmail, { isLoading: resendLoading }] = useResendEmailMutation();
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    let interval;
    if (timer > 0 && !canResend) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer, canResend]);

  const onFinish = async () => {
    if (!otp || otp.length !== 4) {
      message.error("Please enter a valid 4-digit OTP");
      return;
    }

    try {
      const response = await OTPVerify({ emailOrPhone: email, oneTimeCode: otp }).unwrap();
      console.log(response)
      if (response.success) {
        message.success(response.message);
        navigate(`/auth/reset-password?verifyToken=${response?.data?.verifyToken}`);
      }
    } catch (error) {
      message.error(error?.data?.message || "Verification failed");
    }
  };

  const handleResendEmail = async () => {
    if (!canResend) return;

    try {
      const response = await ResendEmail(email).unwrap();
      if (response.success) {
        message.success(response.message);
        setTimer(60);
        setCanResend(false);
      }
    } catch (error) {
      message.error(error?.data?.message || "Failed to resend OTP");
    }
  };

  return (
    <div>
      <div className="mb-6 text-center">
        <h1 className="text-[25px] font-semibold mb-6">Verify OTP</h1>
        <p className="w-[80%] mx-auto">
          We've sent a verification code to your email. Check your inbox and
          enter the code here.
        </p>
      </div>

      <Form layout="vertical" onFinish={onFinish}>
        <div className="flex items-center justify-center mb-6">
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={4}
            inputStyle={{
              height: 50,
              width: 50,
              borderRadius: "8px",
              margin: "16px",
              fontSize: "20px",
              border: "1px solid #FF6600",
              color: "#FF6600",
              outline: "none",
              marginBottom: 10,
            }}
            renderInput={(props) => <input {...props} />}
          />
        </div>

        <div className="flex items-center justify-between mb-6">
          <Text>Didn't receive code?</Text>
          {canResend ? (
            <Text
              onClick={handleResendEmail}
              className="font-medium"
              style={{ color: "#18a0fb", cursor: "pointer" }}
            >
              Resend OTP
            </Text>
          ) : (
            <Text type="secondary">
              Resend in {timer}s
            </Text>
          )}
        </div>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            htmlType="submit"
            loading={isLoading}
            style={{
              width: "100%",
              height: 45,
              border: "1px solid #FF6600",
              outline: "none",
              boxShadow: "none",
              background: "#FF6600",
              color: "white",
            }}
            disabled={!otp || otp.length !== 4}
          >
            {isLoading ? "Verifying..." : "Verify"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default VerifyOtp;