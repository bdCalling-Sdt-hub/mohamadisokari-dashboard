import React, { useState } from "react";
import {
  Table,
  ConfigProvider,
  Modal,
  Form,
  Input,
  Upload,
  message,
  Button,
} from "antd";
import {
  PlusOutlined,
  CloudUploadOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import ButtonEDU from "../../../components/common/ButtonEDU";
import man from "../../../assets/man.png";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import GetPageName from "../../../components/common/GetPageName";

function Slider() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [editingKey, setEditingKey] = useState(null);
  const [tableData, setTableData] = useState([
    { key: "1", name: "man", serial: 1, sliderimg: man },
    { key: "2", name: "man", serial: 2, sliderimg: man },
    { key: "3", name: "man", serial: 3, sliderimg: man },
    { key: "4", name: "man", serial: 4, sliderimg: man },
  ]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState(null);

  const showModal = () => {
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setUploadedImage(null);
    setEditingKey(null);
  };

  const handleFormSubmit = (values) => {
    if (!uploadedImage && !isEditing) {
      message.error("Please upload an image!");
      return;
    }

    if (isEditing) {
      // Update existing row
      const updatedData = tableData.map((item) =>
        item.key === editingKey
          ? {
              ...item,
              name: values.name,
              sliderimg: uploadedImage || item.sliderimg,
            }
          : item
      );
      setTableData(updatedData);
      message.success("Slider updated successfully!");
    } else {
      // Add new row
      setTableData([
        ...tableData,
        {
          key: (tableData.length + 1).toString(),
          name: values.name,
          serial: tableData.length + 1,
          sliderimg: uploadedImage,
        },
      ]);
      message.success("Slider added successfully!");
    }

    handleCancel();
  };

  const handleImageUpload = (info) => {
    const file = info.file.originFileObj;
    if (!file) return;

    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setUploadedImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setEditingKey(record.key);
    setUploadedImage(record.sliderimg);
    form.setFieldsValue({ name: record.name });
    setIsModalOpen(true);
  };

  const handleDelete = (key, name) => {
    setDeletingRecord({ key, name });
    setIsDeleteModalOpen(true);
  };

  const onConfirmDelete = () => {
    setTableData(tableData.filter((item) => item.key !== deletingRecord.key));
    message.success("Slider deleted successfully!");
    setIsDeleteModalOpen(false);
  };

  const onCancelDelete = () => {
    message.info("Delete action canceled.");
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
      render: (sliderimg) => <img width={60} src={sliderimg} alt="slider" />,
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
            onClick={() => handleDelete(record.key, record.name)}
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
        
        {/* </ConfigProvider> */}

         <ConfigProvider
              theme={{
                token: {
                  colorPrimary: '#F97316',
                },
              }}
            >
        <Modal
          title="Delete Confirmation"
          visible={isDeleteModalOpen}
          onCancel={onCancelDelete}
          footer={null}
          centered
        >
          <div className="flex flex-col justify-between gap-5">
            <div className="flex justify-center">
              Are you sure you want to delete{" "}
              <span className="ml-1 font-bold">{deletingRecord?.name}</span>?
            </div>
            <div className="flex justify-center gap-4">
              <ButtonEDU actionType="cancel" onClick={onCancelDelete}>
                Cancel
              </ButtonEDU>
              <ButtonEDU actionType="delete" onClick={onConfirmDelete}>
                Delete
              </ButtonEDU>
            </div>
          </div>
        </Modal>

        </ConfigProvider>

        {/* Modal Form */}
        <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#F97316',
        },
      }}
    >
        <Modal
          title={isEditing ? "Edit Slider" : "Add Slider"}
          open={isModalOpen}
          onCancel={handleCancel}
          centered
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter the name!" }]}
            >
              <Input placeholder="Enter slider name" className="h-12" />
            </Form.Item>

            <Form.Item label="Upload Image">
              {uploadedImage ? (
                <div className="relative">
                  <img src={uploadedImage} alt="Uploaded" width={100} />
                  <CloseCircleOutlined
                    className="absolute top-0 right-0 text-red-500 cursor-pointer"
                    onClick={() => setUploadedImage(null)}
                  />
                </div>
              ) : (
                <Upload
                  name="image"
                  listType="picture-card"
                  showUploadList={false}
                  onChange={handleImageUpload}
                >
                  <button style={{ border: 0, background: "none" }}>
                    <CloudUploadOutlined style={{ fontSize: 24 }} />
                    <div>Upload</div>
                  </button>
                </Upload>
              )}
            </Form.Item>

            <div className="flex justify-end">
              <ButtonEDU actionType="save">Save</ButtonEDU>
            </div>
          </Form>
        </Modal>
        </ConfigProvider>
      </div>
    </ConfigProvider>
  );
}

export default Slider;
