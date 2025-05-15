import { useState, useEffect } from "react";
import { Button, Form, Input, Spin } from "antd";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { useGetProfileQuery, useUpdateProfileMutation } from "../../../features/profile/ProfileApi";
import Swal from "sweetalert2";
import { baseURL } from "../../../utils/BaseURL";

const UserProfile = () => {
  const [form] = Form.useForm();
  const [image, setImage] = useState(
    "https://avatars.design/wp-content/uploads/2021/02/corporate-avatars-TN-1.jpg"
  );
  const [imgURL, setImgURL] = useState(image);
  const { data, isLoading: profileLoading , refetch } = useGetProfileQuery();
  const [updateProfile, { isLoading: updateProfileLoading }] = useUpdateProfileMutation();

  // Set form values when data is loaded
  useEffect(() => {
    if (data?.data) {
      const profileData = data.data;
      form.setFieldsValue({
        name: profileData.name,
        email: profileData.email,
        role: profileData.role,
        location: profileData.location
      });
      
      // Set image if available
      if (profileData.image) {
        setImgURL(profileData.image);
      }
    }
  }, [data, form]);

  const handleSubmit = async (values) => {
    try {
      // Create FormData if you need to upload image
      const formData = new FormData();
      if (image) {
        formData.append('image', image);
      }
      formData.append('data', JSON.stringify({name:values.name,location:values.location}));
      
      await updateProfile(formData).unwrap();
      refetch();
      
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Updated Successfully",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      Swal.fire({
        position: "center",
        icon: "error",
        title: "Update Failed",
        text: error?.data?.message || "Something went wrong",
        showConfirmButton: false,
        timer: 1500,
      });
    }
  };

  const onChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setImgURL(imgUrl);
      setImage(file);
    }
  };

  if(profileLoading){
    return <div className="flex justify-center items-center h-[400px]"><Spin /></div>
  }

  return (
    <div className="w-8/12">
      {/* image */}
      <div className="col-row-1">
        <div className="flex items-center justify-center">
          <input
            onChange={onChange}
            type="file"
            name="image"
            id="img"
            style={{ display: "none" }}
            accept="image/*"
          />
          <label
            className="relative"
            htmlFor="img"
            style={{
              width: "195px",
              cursor: "pointer",
              height: "195px",
              borderRadius: "100%",
              border: "1px solid #FF6600",
              background: "white",
              backgroundImage: `url(${data?.data.image ? baseURL + data?.data.image : `${imgURL}`})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div
              className="absolute -right-1 bottom-1"
              style={{
                background: "#E8F6FE",
                width: "50px",
                height: "50px",
                border: "2px solid #FF6600",
                borderRadius: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <MdOutlineAddPhotoAlternate size={22} color="#1D75F2" />
            </div>
          </label>
        </div>
      </div>

      {/* forms */}
      <div className="flex items-center justify-center lg:col-rows-1">
        <Form
          name="normal_login"
          className="login-form"
          layout="vertical"
          style={{ width: "80%" }}
          onFinish={handleSubmit}
          form={form}
        >
          <div className="grid w-full grid-cols-1 lg:grid-cols-2 lg:gap-x-16 gap-y-7">
            <div>
              <Form.Item
                name="name"
                label={<p style={{ display: "block" }}>Full Name</p>}
              >
                <Input
                  placeholder="Enter Your Full Name"
                  type="text"
                  style={{
                    border: "1px solid #E0E4EC",
                    height: "52px",
                    background: "white",
                    borderRadius: "8px",
                    outline: "none",
                  }}
                />
              </Form.Item>
            </div>

            <div>
              <Form.Item
                name="email"
                label={<p style={{ display: "block" }}>Email</p>}
              >
                <Input
                  readOnly
                  style={{
                    border: "1px solid #E0E4EC",
                    height: "52px",
                    background: "#f5f5f5",
                    borderRadius: "8px",
                    outline: "none",
                    color: "rgba(0, 0, 0, 0.65)",
                  }}
                />
              </Form.Item>
            </div>

            <div>
              <Form.Item
                name="role"
                label={<p>Role</p>}
              >
                <Input
                  readOnly
                  style={{
                    border: "1px solid #E0E4EC",
                    height: "52px",
                    background: "#f5f5f5",
                    borderRadius: "8px",
                    outline: "none",
                    color: "rgba(0, 0, 0, 0.65)",
                  }}
                />
              </Form.Item>
            </div>

            <div>
              <Form.Item
                name="location"
                label={<p style={{ display: "block" }}>Location</p>}
              >
                <Input
                  style={{
                    border: "1px solid #E0E4EC",
                    height: "52px",
                    background: "white",
                    borderRadius: "8px",
                    outline: "none",
                  }}
                />
              </Form.Item>
            </div>
          </div>

          <div className="mt-6 text-end">
            <Form.Item>
              <Button
                htmlType="submit"
                loading={updateProfileLoading}
                block
                style={{
                  border: "none",
                  height: "41px",
                  background: "#FF6600",
                  color: "white",
                  borderRadius: "8px",
                  outline: "none",
                  width: "150px",
                }}
              >
                Save
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default UserProfile;