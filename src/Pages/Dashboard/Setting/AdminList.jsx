import { DeleteFilled, MoreOutlined } from "@ant-design/icons";
import {
  Button,
  ConfigProvider,
  Flex,
  Form,
  Input,
  message,
  Modal,
  Popover,
  Spin,
  Table,
} from "antd";
import { useEffect, useRef, useState } from "react";
import { FaPlus } from "react-icons/fa6";

import toast from "react-hot-toast";
import ButtonEDU from "../../../components/common/ButtonEDU";
import { useCreateAdminMutation, useDeleteAdminMutation, useGetAllAdminQuery } from "../../../features/createAdmin/CreateAdmin";


const AdminList = () => {
  // API hooks
  const { data: adminData, isLoading, refetch } = useGetAllAdminQuery();
  const [createAdmin, { isLoading: isCreating }] = useCreateAdminMutation();
  const [deleteAdmin, { isLoading: isDeleting }] = useDeleteAdminMutation();

  const [searchText, setSearchText] = useState("");
  const [admins, setAdmins] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [selectedAdmin, setSelectedAdmin] = useState(null);

  const addFormRef = useRef(null);

  // Update admins when data is fetched
  useEffect(() => {
    if (adminData?.data) {
      const formattedAdmins = adminData.data.map((admin, index) => ({
        key: admin._id || index + 1,
        name: admin.name,
        email: admin.email,
        creationdate: new Date(admin.createdAt).toLocaleDateString() || "N/A",
        _id: admin._id,
      }));
      setAdmins(formattedAdmins);
      setFilteredData(formattedAdmins);
    }
  }, [adminData]);

  // Search functionality
  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = admins.filter(
      (item) =>
        item.name.toLowerCase().includes(value) ||
        item.email.toLowerCase().includes(value)
    );

    setFilteredData(filtered);
  };

  // Open Add Admin Modal
  const showAddModal = () => {
    setIsAddModalOpen(true);
  };

  // Close Add Admin Modal
  const handleCancelAdd = () => {
    setIsAddModalOpen(false);
    addFormRef.current?.resetFields();
    message.info("Admin addition cancelled.");
  };

  const handleAddAdmin = async (values) => {
    try {
      // Prepare data for API
      const adminData = {
        name: values.name,
        email: values.email,
        contactNumber: values.contactNumber || "",
        password: values.password,
      };

      // Call API to create admin
      const response = await createAdmin(adminData).unwrap();

      // Close modal and reset form first
      setIsAddModalOpen(false);
      addFormRef.current?.resetFields();

      // Show success message
      toast.success("Admin added successfully!");
      refetch();

    } catch (error) {
      // toast.error(`Failed to add admin: ${error.data?.message || error.message || "Unknown error"}`);
    }
  };

  // Open Delete Admin Modal
  const showDeleteModal = (record) => {
    setSelectedAdmin(record);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete Admin
  const handleConfirmDelete = async () => {
    if (!selectedAdmin) return;

    try {
      // Call API to delete admin
      await deleteAdmin(selectedAdmin._id).unwrap();

      // Close modal first
      setIsDeleteModalOpen(false);

      // Show success message
      toast.success("Admin deleted successfully!");

      // Wait a brief moment before refetching
      setTimeout(() => {
        refetch().catch(error => {
          console.error("Error refetching admin data:", error);
          // Don't show this error to the user
        });
      }, 500);

    } catch (error) {
      toast.error(`Failed to delete admin: ${error.data?.message || error.message || "Unknown error"}`);
    }
  };

  return (
    <div className="w-[60%] bg-white rounded-lg shadow-lg p-5">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#F97316',
          },
        }}
      >
        <TableHead
          searchText={searchText}
          handleSearch={handleSearch}
          onAdd={showAddModal}
        />

        {isLoading ? (
          <div className="flex justify-center items-center p-10">
            <Spin size="default" />
          </div>
        ) : (
          <TableBody
            filteredData={filteredData}
            onDelete={showDeleteModal}
          />
        )}
      </ConfigProvider>

      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#F97316',
          },
        }}
      >
        {/* Add Admin Modal */}
        <Modal
          title="Add Admin"
          open={isAddModalOpen}
          onCancel={handleCancelAdd}
          footer={null}
          className="z-50"
        >
          <ConfigProvider
            theme={{
              components: {
                Form: {
                  labelFontSize: 16,
                },
              },
            }}
          >
            <Form layout="vertical" ref={addFormRef} onFinish={handleAddAdmin}>
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please enter Name" }]}
              >
                <Input placeholder="Name" className="h-10" />
              </Form.Item>
              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Please enter Email" },
                  {
                    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                    message: "Please enter a valid email address",
                  },
                ]}
              >
                <Input placeholder="Email" className="h-10" />
              </Form.Item>
              <Form.Item
                label="Contact Number"
                name="contactNumber"
                rules={[{ required: true, message: "Please enter Contact Number" }]}
              >
                <Input placeholder="Contact Number" className="h-10" />
              </Form.Item>
              <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: "Please enter Password" }]}
              >
                <Input.Password placeholder="Set a Password" className="h-10" />
              </Form.Item>
              <div className="flex justify-end gap-4 mt-4">
                <ButtonEDU actionType="cancel" onClick={handleCancelAdd} disabled={isCreating}>
                  Cancel
                </ButtonEDU>
                <ButtonEDU
                  actionType="save"
                  onClick={() => addFormRef.current?.submit()}
                  loading={isCreating}
                >
                  {isCreating ? <Spin size="small" /> : 'Save'}
                </ButtonEDU>
              </div>
            </Form>
          </ConfigProvider>
        </Modal>
      </ConfigProvider>

      {/* Delete Admin Modal */}
      <Modal
        title="Delete Admin"
        open={isDeleteModalOpen}
        onCancel={() => !isDeleting && setIsDeleteModalOpen(false)}
        footer={null}
        centered
        className="z-50"
      >
        <DeleteAdmin
          name={selectedAdmin?.name}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleteModalOpen(false)}
          isDeleting={isDeleting}
        />
      </Modal>
    </div>
  );
};

const TableHead = ({ searchText, handleSearch, onAdd }) => {
  return (
    <div className="flex items-center justify-between mb-4">
      <Input
        placeholder="Search admins..."
        value={searchText}
        onChange={handleSearch}
        className="w-1/3 h-10"
        allowClear
      />
      <ButtonEDU actionType="add" onClick={onAdd}>
        <div className="flex items-center justify-center gap-2">
          <FaPlus size={15} /> Add new
        </div>
      </ButtonEDU>
    </div>
  );
};

const TableBody = ({ filteredData, onDelete }) => (
  <Table
    rowKey={(record) => record.key}
    columns={columns(onDelete)}
    dataSource={filteredData}
    pagination={false}
    className="mt-5"
  />
);

const DeleteAdmin = ({ name, onConfirm, onCancel, isDeleting }) => (
  <Flex
    vertical
    justify="space-between"
    className="w-full h-full mt-3 mb-3"
    gap={20}
  >
    <Flex align="center" justify="center">
      Are you sure you want to delete{" "}
      <span className="ml-1 font-bold">{name}</span>?
    </Flex>
    <div className="flex items-center justify-center gap-4">
      <ButtonEDU actionType="cancel" onClick={onCancel} disabled={isDeleting}>
        Cancel
      </ButtonEDU>
      <ButtonEDU actionType="delete" onClick={onConfirm} loading={isDeleting}>
        {isDeleting ? <Spin size="small" /> : 'Delete'}
      </ButtonEDU>
    </div>
  </Flex>
);

const columns = (onDelete) => [
  { title: "Name", dataIndex: "name", key: "name" },
  { title: "Email", dataIndex: "email", key: "email" },
  { title: "Role", dataIndex: "role", key: "role" },
  { title: "Creation Date", dataIndex: "creationdate", key: "creationdate" },
  {
    key: "action",
    render: (_, record) => (
      <Popover
        content={
          <div className="flex gap-3">
            <Button onClick={() => onDelete(record)} danger>
              <DeleteFilled />
            </Button>
          </div>
        }
        trigger="hover"
      >
        <MoreOutlined />
      </Popover>
    ),
  },
];

export default AdminList;