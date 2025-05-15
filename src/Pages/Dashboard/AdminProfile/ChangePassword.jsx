import { Button, Form, Input } from "antd";
import toast from "react-hot-toast";
import { useChangePasswordMutation } from "../../../features/createAdmin/CreateAdmin";

const ChangePassword = () => {
  const [form] = Form.useForm();
  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleChangePassword = async (values) => {
    try {
      const trimmedValues = {
        currentPassword: values.currentPassword.trim(),
        newPassword: values.newPassword.trim(),
        confirmPassword: values.confirmPassword.trim(),
      };

      // Validate new password and confirm password match
      if (trimmedValues.newPassword !== trimmedValues.confirmPassword) {
        toast.error("New password and confirm password do not match");
        return;
      }

      // Validate new password is different from current password
      if (trimmedValues.currentPassword === trimmedValues.newPassword) {
        toast.error("New password must be different from current password");
        return;
      }

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

  // Password validation rules
  const passwordRules = [
    { required: true, message: "Please input your password!" },
    { min: 8, message: "Password must be at least 8 characters long!" },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      message: "Password must contain uppercase, lowercase, number, and special character!",
    },
  ];

  return (
    <div className="max-w-2xl p-4">
      <h2 className="text-2xl font-bold mb-6">Change Password</h2>
      <Form
        form={form}
        layout="vertical"
        initialValues={{ remember: true }}
        onFinish={handleChangePassword}
      >
        {/* Current Password */}
        <Form.Item
          name="currentPassword"
          label="Current Password"
          rules={[
            { required: true, message: "Please input your current password!" },
          ]}
          className="mb-6"
        >
          <Input.Password
            placeholder="Enter current password"
            style={{
              border: "1px solid #E0E4EC",
              height: "52px",
              borderRadius: "8px",
            }}
            disabled={isLoading}
          />
        </Form.Item>

        {/* New Password */}
        <Form.Item
          name="newPassword"
          label="New Password"
          rules={passwordRules}
          className="mb-6"
          hasFeedback
        >
          <Input.Password
            placeholder="Enter new password"
            style={{
              border: "1px solid #E0E4EC",
              height: "52px",
              borderRadius: "8px",
            }}
            disabled={isLoading}
          />
        </Form.Item>

        {/* Confirm Password */}
        <Form.Item
          name="confirmPassword"
          label="Confirm New Password"
          dependencies={['newPassword']}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The passwords you entered do not match!")
                );
              },
            }),
          ]}
          className="mb-8"
        >
          <Input.Password
            placeholder="Confirm new password"
            style={{
              border: "1px solid #E0E4EC",
              height: "52px",
              borderRadius: "8px",
            }}
            disabled={isLoading}
          />
        </Form.Item>

        {/* Submit Button */}
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            style={{
              height: "41px",
              background: "#FF6600",
              borderRadius: "8px",
              width: "150px",
            }}
          >
            {isLoading ? "Updating..." : "Update Password"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ChangePassword;