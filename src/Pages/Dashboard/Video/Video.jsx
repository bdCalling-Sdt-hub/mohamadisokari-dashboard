import {
  CloseCircleOutlined,
  CloudUploadOutlined,
  PlayCircleOutlined,
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
import { useRef, useState } from "react";
import { FiEdit2 } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";
import ButtonEDU from "../../../components/common/ButtonEDU";
import GetPageName from "../../../components/common/GetPageName";
import {
  useCreateVideoMutation,
  useDeleteVideoMutation,
  useGetSingleVideoQuery,
  useGetvideoQuery,
  useUpdateVideoMutation
} from "../../../features/video/videoApi";
import { baseURL } from "../../../utils/BaseURL";

function Video() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [uploadedVideo, setUploadedVideo] = useState(null);
  const [currentVideoUrl, setCurrentVideoUrl] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewVideoId, setPreviewVideoId] = useState(null);
  const videoRef = useRef(null);

  const {
    data: videoData,
    isLoading: getLoading,
    refetch,
  } = useGetvideoQuery();
  const { data: singleVideoData, isLoading: singleVideoLoading } = useGetSingleVideoQuery(
    previewVideoId,
    { skip: !previewVideoId }
  );
  const [createVideo, { isLoading: createLoading }] = useCreateVideoMutation();
  const [updateVideo, { isLoading: updateLoading }] = useUpdateVideoMutation();
  const [deleteVideo, { isLoading: deleteLoading }] = useDeleteVideoMutation();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingRecord, setDeletingRecord] = useState(null);

  const showModal = () => {
    setIsEditing(false);
    setIsModalOpen(true);
    form.resetFields();
    setUploadedVideo(null);
    setCurrentVideoUrl(null);
    setEditingId(null);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    form.resetFields();
    setUploadedVideo(null);
    setCurrentVideoUrl(null);
    setEditingId(null);
  };

  const handleFormSubmit = async (values) => {
    // Only require a video if we're creating a new entry and no video is uploaded
    if (!uploadedVideo && !isEditing && !currentVideoUrl) {
      message.error("Please upload a video!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("data", JSON.stringify({ title: values.title }));
      if (uploadedVideo) {
        formData.append("video", uploadedVideo);
      }

      if (isEditing) {
        await updateVideo({ id: editingId, data: formData }).unwrap();
        message.success("Video updated successfully!");
      } else {
        await createVideo(formData).unwrap();
        message.success("Video added successfully!");
      }

      refetch();
      handleCancel();
    } catch (error) {
      message.error(error.data?.message || "Something went wrong!");
    }
  };

  // Fixed handleVideoUpload function
  const handleVideoUpload = ({ file }) => {
    // In Ant Design's Upload component, the file comes directly as a parameter
    if (!file) return;

    const isVideo = file.type.startsWith("video/");
    if (!isVideo) {
      message.error("You can only upload video files!");
      return;
    }

    setUploadedVideo(file);
  };

  const handleEdit = (record) => {
    setIsEditing(true);
    setEditingId(record._id);
    setCurrentVideoUrl(record.videoUrl);
    form.setFieldsValue({
      title: record.title,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    setDeletingRecord(record);
    setIsDeleteModalOpen(true);
  };

  const onConfirmDelete = async () => {
    try {
      await deleteVideo(deletingRecord._id).unwrap();
      message.success("Video deleted successfully!");
      refetch();
    } catch (error) {
      message.error(error.data?.message || "Failed to delete video");
    }
    setIsDeleteModalOpen(false);
  };

  const onCancelDelete = () => {
    setIsDeleteModalOpen(false);
  };

  const handleClosePreviewModal = () => {
    // Stop the video playback
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    // Close modal and clear state
    setIsPreviewModalOpen(false);
    setPreviewVideoId(null);
  };

  const showPreviewModal = (videoId) => {
    // If there's an existing preview video, make sure to stop it
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }

    // Set the new video ID and open modal
    setPreviewVideoId(videoId);
    setIsPreviewModalOpen(true);
  };

  const columns = [
    {
      title: "Sl",
      dataIndex: "index",
      key: "index",
      render: (_, __, index) => (
        <p className="font-normal text-black text-[16px]">
          {index + 1 < 10 ? "0" + (index + 1) : index + 1}
        </p>
      ),
    },
    {
      title: "Video",
      dataIndex: "videoUrl",
      key: "videoUrl",
      render: (videoUrl, record) => (
        <div className="relative cursor-pointer" onClick={() => showPreviewModal(record._id)}>
          <video width={120} className="h-20 object-cover">
            <source src={`${baseURL}${videoUrl}`} type="video/mp4" />
          </video>
          <PlayCircleOutlined
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-2xl bg-black bg-opacity-50 rounded-full p-1"
          />
        </div>
      ),
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-6">
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
            className="bg-smart h-9 text-white px-4 py-2.5 rounded-md flex items-center"
            onClick={showModal}
          >
            Add New
          </ButtonEDU>
        </div>

        <Spin spinning={getLoading}>
          <Table
            columns={columns}
            dataSource={videoData?.data?.map((item, index) => ({
              ...item,
              index: index + 1,
              key: item._id,
            }))}
            pagination={{
              pageSizeOptions: [5, 10, 15, 20],
              defaultPageSize: 5,
              position: ["end"],
            }}
          />
        </Spin>

        {/* Delete Confirmation Modal */}
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#F97316",
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
            <div className="flex flex-col justify-between gap-5">
              <div className="flex justify-center">
                Are you sure you want to delete{" "}
                <span className="ml-1 font-bold">{deletingRecord?.title}</span>?
              </div>
              <div className="flex justify-center gap-4">
                <ButtonEDU actionType="cancel" onClick={onCancelDelete}>
                  Cancel
                </ButtonEDU>
                <ButtonEDU
                  actionType="delete"
                  onClick={onConfirmDelete}
                  loading={deleteLoading}
                >
                  Delete
                </ButtonEDU>
              </div>
            </div>
          </Modal>
        </ConfigProvider>

        {/* Video Preview Modal */}
        <Modal
          title="Video Preview"
          open={isPreviewModalOpen}
          onCancel={handleClosePreviewModal}
          onOk={handleClosePreviewModal}
          footer={null}
          width={800}
          centered
          destroyOnClose={true}
        >
          <Spin spinning={singleVideoLoading}>
            <div className="flex justify-center">
              {singleVideoData?.data?.videoUrl ? (
                <video
                  ref={videoRef}
                  controls
                  autoPlay
                  style={{ width: "100%", maxHeight: "70vh" }}
                  onError={() => message.error("Failed to load video")}
                >
                  <source src={`${baseURL}${singleVideoData.data.videoUrl}`} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <p>Loading video...</p>
              )}
            </div>
          </Spin>
        </Modal>

        {/* Add/Edit Video Modal */}
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#F97316",
            },
          }}
        >
          <Modal
            title={isEditing ? "Edit Video" : "Add Video"}
            open={isModalOpen}
            onCancel={handleCancel}
            centered
            footer={null}
          >
            <Spin spinning={createLoading || updateLoading}>
              <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                <Form.Item
                  label="Title"
                  name="title"
                  rules={[
                    { required: true, message: "Please enter the Title!" },
                  ]}
                >
                  <Input placeholder="Enter video title" className="h-9" />
                </Form.Item>

                <Form.Item label="Upload Video">
                  {uploadedVideo ? (
                    <div className="relative">
                      <video width={200} controls>
                        <source
                          src={URL.createObjectURL(uploadedVideo)}
                          type={uploadedVideo.type}
                        />
                      </video>
                      <CloseCircleOutlined
                        className="absolute top-0 right-0 text-red-500 cursor-pointer"
                        onClick={() => setUploadedVideo(null)}
                      />
                    </div>
                  ) : isEditing && currentVideoUrl ? (
                    <div className="relative">
                      <video width={200} controls>
                        <source src={`${baseURL}${currentVideoUrl}`} type="video/mp4" />
                      </video>
                      <CloseCircleOutlined
                        className="absolute top-0 right-0 text-red-500 cursor-pointer"
                        onClick={() => setCurrentVideoUrl(null)}
                      />
                    </div>
                  ) : (
                    <Upload
                      name="video"
                      listType="picture-card"
                      showUploadList={false}
                      customRequest={() => { }} // Prevent default upload behavior
                      onChange={handleVideoUpload}
                      accept="video/*"
                      beforeUpload={() => false}
                    >
                      <button style={{ border: 0, background: "none" }}>
                        <CloudUploadOutlined style={{ fontSize: 24 }} />
                        <div>Upload Video</div>
                      </button>
                    </Upload>
                  )}
                </Form.Item>

                <div className="flex justify-end">
                  <ButtonEDU actionType="save" loading={createLoading || updateLoading}>
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

export default Video;