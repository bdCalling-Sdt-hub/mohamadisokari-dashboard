import React from 'react';
import { FiMail, FiMapPin, FiPhone, FiUser } from 'react-icons/fi';


const user = {
    name: 'Amina Ali',
    email: 'amina.ali@example.so',
    phone: '+252 61 2345678',
    address: 'Mogadishu, Banaadir (Somalia)',
    memberSince: 'March 2025',
    profileImage: '/profile-image.jpg' // You would replace this with your actual image path
  };

const Imformation = () => {

    return (
        <div className="flex-1 p-6 bg-white rounded-lg shadow-sm">
        <div className="space-y-6">
          <div className="p-6 border rounded shadow">
            <div className="flex items-center mb-1">
              <FiUser className="w-5 h-5 mr-2 text-orange-500" />
              <span className="text-sm text-gray-500">Name</span>
            </div>
            <p className="text-gray-800 ml-7">{user.name}</p>
          </div>
          
          <div className="p-6 border rounded shadow ">
            <div className="flex items-center mb-1">
              <FiMail className="w-5 h-5 mr-2 text-orange-500" />
              <span className="text-sm text-gray-500">Email</span>
            </div>
            <p className="text-gray-800 ml-7">{user.email}</p>
          </div>
          
          <div className="p-6 border rounded shadow">
            <div className="flex items-center mb-1">
              <FiPhone className="w-5 h-5 mr-2 text-orange-500" />
              <span className="text-sm text-gray-500">Phone</span>
            </div>
            <p className="text-gray-800 ml-7">{user.phone}</p>
          </div>
          
          <div className='p-6 border rounded shadow'>
            <div className="flex items-center mb-1">
              <FiMapPin className="w-5 h-5 mr-2 text-orange-500" />
              <span className="text-sm text-gray-500">Address</span>
            </div>
            <p className="text-gray-800 ml-7">{user.address}</p>
          </div>
        </div>
      </div>
    
    );
};

export default Imformation;