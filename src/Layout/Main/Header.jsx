import { DownOutlined } from "@ant-design/icons";
import { Avatar, Badge, ConfigProvider, Dropdown, Tooltip } from "antd";
import { FaRegBell, FaUser } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { useGetProfileQuery } from "../../features/profile/ProfileApi";
import { baseURL } from "../../utils/BaseURL";

const Header = ({ toggleSidebar }) => {

  const { data } = useGetProfileQuery();




  const userMenuItems = [
    {
      label: <Link to="/profile" className="flex items-center gap-2"><FaUser /> Profile</Link>,
      key: "profile"
    },
    // { 
    //   label: <Link to="/auth/login" className="flex items-center gap-2 text-red-500">Log Out</Link>, 
    //   key: "logout" 
    // }
  ];

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#18a0fb',
          borderRadius: 12,
        },
        components: {
          Dropdown: {
            colorBgElevated: '#f4f7fa',
            borderRadiusLG: 12,
            boxShadowSecondary: '0 4px 12px rgba(0,0,0,0.1)',
          },
        },
      }}
    >
      <div className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-subtle">
        <div className="px-4 py-3 ">
          <div className="flex items-center justify-between">
            {/* Sidebar Toggle */}
            <div className="flex items-start">

              <div className="flex items-center justify-start gap-3 px-4 ">
                <p className="text-2xl font-semibold text-[#F97316]">Dashboard</p>
              </div>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center pr-20 space-x-6">
              {/* Notification */}
              <div className="relative">
                <Link
                  to="/notification"
                  className="relative block p-2 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100"
                >
                  <Tooltip title="Notification"><FaRegBell size={24} className="text-[#FF6600] hover:text-[#FF6600] transition-colors" /></Tooltip>
                  <Badge
                    dot
                    status="error"
                    className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2"
                  />
                </Link>
              </div>

              {/* User Profile Dropdown */}
              <Dropdown
                menu={{ items: userMenuItems }}
                trigger={['click']}
                dropdownRender={(menu) => (
                  <div className="overflow-hidden bg-white border border-gray-100 shadow-lg rounded-xl">
                    {menu}
                  </div>
                )}
              >
                <div className="flex items-center p-2 transition-colors rounded-lg cursor-pointer hover:bg-gray-50">
                  <Avatar
                        src={data?.data?.image ? `${baseURL}${data?.data?.image}` : null}
                        size={48}
                        className="mr-3 border-2 border-blue-100"
                        icon={!data?.data?.image ? <FaUser /> : null}
                      />
                  <div>
                    <div className="font-semibold text-gray-800">
                      {`${data?.data?.name}`}
                      <DownOutlined className="ml-2 text-xs text-gray-500" />
                    </div>
                    <p className="text-xs text-gray-500">{data?.data?.role}</p>
                  </div>
                </div>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Header;