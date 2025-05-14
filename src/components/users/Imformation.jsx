import { Spin } from 'antd';
import { FiMail, FiMapPin, FiPhone, FiUser } from 'react-icons/fi';
import { useParams } from 'react-router-dom';
import { useGetPerticularUserQuery } from '../../features/userManagement/UserManagementApi';


const Imformation = () => {
  const { id } = useParams();
  const { data, isLoading } = useGetPerticularUserQuery(id);

  if (isLoading) return <div className='flex justify-center items-center h-[200px]'><Spin /></div>

  return (
    <div className="flex-1 p-6 bg-white rounded-lg shadow-sm">
      <div className="space-y-6">
        <div className="p-6 border rounded shadow">
          <div className="flex items-center mb-1">
            <FiUser className="w-5 h-5 mr-2 text-orange-500" />
            <span className="text-sm text-gray-500">Name</span>
          </div>
          <p className="text-gray-800 ml-7">{data?.data?.name}</p>
        </div>

        <div className="p-6 border rounded shadow ">
          <div className="flex items-center mb-1">
            <FiMail className="w-5 h-5 mr-2 text-orange-500" />
            <span className="text-sm text-gray-500">Email</span>
          </div>
          <p className="text-gray-800 ml-7">{data?.data?.email}</p>
        </div>

        <div className="p-6 border rounded shadow">
          <div className="flex items-center mb-1">
            <FiPhone className="w-5 h-5 mr-2 text-orange-500" />
            <span className="text-sm text-gray-500">Phone</span>
          </div>
          <p className="text-gray-800 ml-7">{data?.data?.contactNumber}</p>
        </div>

        <div className='p-6 border rounded shadow'>
          <div className="flex items-center mb-1">
            <FiMapPin className="w-5 h-5 mr-2 text-orange-500" />
            <span className="text-sm text-gray-500">Address</span>
          </div>
          <p className="text-gray-800 ml-7">{data?.data?.location}</p>
        </div>
      </div>
    </div>

  );
};

export default Imformation;