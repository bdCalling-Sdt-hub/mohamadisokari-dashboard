import {
  CloseCircleOutlined,
  CloudUploadOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import {
  ConfigProvider,
  Form,
  Input,
  Modal,
  Spin,
  Table,
  Upload,
  message
} from "antd";
import { useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import ButtonEDU from "../../../components/common/ButtonEDU";
import GetPageName from "../../../components/common/GetPageName";
import {
  useCreateBannerMutation,
  useDeleteBannerMutation,
  useGetBannerQuery,
  useUpdateBannerMutation
} from "../../../features/banner/bannerApi";
import { baseURL } from "../../../utils/BaseURL";

function Slider() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState(null);
  const [fileList, setFileList] = useState([]);

  // API hooks
  const { data: bannerData, isLoading: getLoading, refetch } = useGetBannerQuery();
  const [createBanner, { isLoading: createLoading }] = useCreateBannerMutation();
  const [updateBanner, { isLoading: updateLoading }] = useUpdateBannerMutation();
  const [deleteBanner, { isLoading: deleteLoading }] = useDeleteBannerMutation();

  // Format data for table
  const formatTableData = (data) => {
    if (!data) return [];
    return data.map((item, index) => ({
      key: item._id,
      serial: index + 1,
      name: item.name,
      sliderimg: item.image,
      _id: item._id
    }));
  };

  const tableData = formatTableData(bannerData?.data);

  const showModal = () => {
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setUploadedImage(null);
    setEditingId(null);
    setFileList([]);
  };

  const handleFormSubmit = async (values) => {
    if (!uploadedImage && !isEditing) {
      message.error("Please upload an image!");
      return;
    }

    const formData = new FormData();
    formData.append('data', JSON.stringify({ name: values.name }));
    if (uploadedImage && uploadedImage.originFileObj) {
      formData.append('image', uploadedImage.originFileObj);
    }

    try {
      if (isEditing) {
        await updateBanner({ id: editingId, data: formData }).unwrap();
        message.success("Banner updated successfully!");
      } else {
        await createBanner(formData).unwrap();
        message.success("Banner created successfully!");
      }
      refetch();
      handleCancel();
    } catch (error) {
      message.error(error.data?.message || "Something went wrong!");
    }
  };

  const handleImageUpload = ({ fileList }) => {
    setFileList(fileList);
    if (fileList.length > 0) {
      setUploadedImage(fileList[0]);
    } else {
      setUploadedImage(null);
    }
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setEditingId(record._id);
    form.setFieldsValue({ name: record.name });
    setUploadedImage({ url: record.sliderimg });
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    setDeletingRecord(record);
    setIsDeleteModalOpen(true);
  };

  const onConfirmDelete = async () => {
    try {
      await deleteBanner(deletingRecord._id).unwrap();
      message.success("Banner deleted successfully!");
      refetch();
      setIsDeleteModalOpen(false);
    } catch (error) {
      message.error(error.data?.message || "Failed to delete banner");
    }
  };

  const onCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const columns = [
    {
      title: "Sl",
      dataIndex: "serial",
      key: "serial",
      render: (serial) => (
        <p className="font-normal text-black text-[16px]">
          {serial < 10 ? "0" + serial : serial}
        </p>
      ),
    },
    {
      title: "Slider Image",
      dataIndex: "sliderimg",
      key: "sliderimg",
      render: (sliderimg) => (
        <img
          width={60}
          src={sliderimg.startsWith('/') ? `${baseURL}${sliderimg}` : sliderimg}
          alt="slider"
        />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-7">
          <FiEdit2
            style={{ fontSize: 18 }}
            className="text-black cursor-pointer hover:text-blue-500"
            onClick={() => handleEdit(record)}
          />
          <RiDeleteBin6Line
            style={{ fontSize: 18 }}
            className="text-black cursor-pointer hover:text-red-500"
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            rowSelectedBg: "#f6f6f6",
            headerBg: "#f6f6f6",
            headerSplitColor: "none",
            headerBorderRadius: "none",
            cellFontSize: "16px",
          },
          Pagination: {
            borderRadius: "3px",
            itemActiveBg: "#18a0fb",
          },
          Form: {
            labelFontSize: 16,
          },
          Button: {
            defaultHoverBg: "#18a0fb ",
            defaultHoverColor: "white",
            defaultHoverBorderColor: "#18a0fb ",
          },
        },
      }}
    >
      <div className="w-8/12 py-5">
        <div className="flex items-center justify-between py-5">
          <h1 className="text-[20px] font-medium">{GetPageName()}</h1>
          <ButtonEDU
            icon={<PlusOutlined className="mr-2" />}
            className="bg-smart  h-9 text-white px-4 py-2.5 rounded-md flex items-center"
            onClick={showModal}
          >
            Add New
          </ButtonEDU>
        </div>

        <Spin spinning={getLoading} tip="Loading banners...">
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: '#F97316',
              },
            }}
          >
            <Table
              columns={columns}
              dataSource={tableData}
              pagination={{
                pageSizeOptions: [5, 10, 15, 20],
                defaultPageSize: 5,
                position: ["End"],
              }}
            />
          </ConfigProvider>
        </Spin>

        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#F97316',
            },
          }}
        >
          <Modal
            title="Delete Confirmation"
            open={isDeleteModalOpen}
            onCancel={onCancelDelete}
            footer={null}
            centered
          >
            <Spin spinning={deleteLoading} tip="Deleting...">
              <div className="flex flex-col justify-between gap-5">
                <div className="flex justify-center">
                  Are you sure you want to delete{" "}
                  <span className="ml-1 font-bold">{deletingRecord?.name}</span>?
                </div>
                <div className="flex justify-center gap-4">
                  <ButtonEDU actionType="cancel" onClick={onCancelDelete}>
                    Cancel
                  </ButtonEDU>
                  <ButtonEDU
                    actionType="delete"
                    onClick={onConfirmDelete}
                    disabled={deleteLoading}
                  >
                    Delete
                  </ButtonEDU>
                </div>
              </div>
            </Spin>
          </Modal>
        </ConfigProvider>

        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#F97316',
            },
          }}
        >
          <Modal
            title={isEditing ? "Edit Banner" : "Add Banner"}
            open={isModalOpen}
            onCancel={handleCancel}
            centered
            footer={null}
          >
            <Spin spinning={isEditing ? updateLoading : createLoading} tip={isEditing ? "Updating..." : "Creating..."}>
              <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                <Form.Item
                  label="Name"
                  name="name"
                  rules={[{ required: true, message: "Please enter the name!" }]}
                >
                  <Input placeholder="Enter banner name" className="h-12" />
                </Form.Item>

                <Form.Item label="Upload Image">
                  {uploadedImage?.url ? (
                    <div className="relative">
                      <img
                        src={uploadedImage.url.startsWith('/')
                          ? `${baseURL}${uploadedImage.url}`
                          : uploadedImage.url}
                        alt="Uploaded"
                        width={100}
                      />
                      <CloseCircleOutlined
                        className="absolute top-0 right-0 text-red-500 cursor-pointer"
                        onClick={() => {
                          setUploadedImage(null);
                          setFileList([]);
                        }}
                      />
                    </div>
                  ) : (
                    <Upload
                      name="image"
                      listType="picture-card"
                      fileList={fileList}
                      beforeUpload={() => false} // Prevent auto upload
                      onChange={handleImageUpload}
                      maxCount={1}
                    >
                      {fileList.length >= 1 ? null : (
                        <div>
                          <CloudUploadOutlined style={{ fontSize: 24 }} />
                          <div>Upload</div>
                        </div>
                      )}
                    </Upload>
                  )}
                </Form.Item>

                <div className="flex justify-end">
                  <ButtonEDU
                    actionType="save"
                    loading={isEditing ? updateLoading : createLoading}
                  >
                    Save
                  </ButtonEDU>
                </div>
              </Form>
            </Spin>
          </Modal>
        </ConfigProvider>
      </div>
    </ConfigProvider>
  );
}

export default Slider;