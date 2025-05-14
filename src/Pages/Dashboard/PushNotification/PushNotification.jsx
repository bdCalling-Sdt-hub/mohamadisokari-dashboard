import { Button, ConfigProvider, Form, Input } from "antd";
import toast from "react-hot-toast";
import { FaRegPaperPlane } from "react-icons/fa6";
import { useSendPushNotificationMutation } from "../../../features/pushNotification/PushNotification";
// import purle from "../../../assets/gtdandy/purple.jpg";
function PushNotification() {
  const [form] = Form.useForm();

  const [pushNotification, { isLoading }] = useSendPushNotificationMutation();

  // Handle form submission
  const onFinish = async (values) => {
    try {
      const response = await pushNotification(values).unwrap();
      console.log(response);
      toast.success('Notification sent successfully');
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message);
    }

    form.resetFields();
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
                  loading={isLoading}
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
