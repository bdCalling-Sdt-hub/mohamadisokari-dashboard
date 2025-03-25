import React, { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const Main = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  return (
    <div className="flex w-screen h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} />

      {/* Main Content */}
      <div className="flex flex-col flex-1 h-screen">
        <Header toggleSidebar={toggleSidebar} />
        <div className="flex-1 p-4 overflow-auto bg-slate-100">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Main;

// import React, { useState } from "react";
// import Sidebar from "./Sidebar";
// import Header from "./Header";
// import { Outlet } from "react-router-dom";

// const Main = () => {
//   const [isCollapsed, setIsCollapsed] = useState(false);

//   const toggleSidebar = () => {
//     setIsCollapsed((prev) => !prev);
//   };

//   return (
//     <div className="flex w-screen h-screen bg-white">
//       {/* Sidebar */}
//       <Sidebar isCollapsed={isCollapsed} />

//       {/* Main Content */}
//       <div className="flex flex-col flex-1 transition-all duration-300">
//         <Header toggleSidebar={toggleSidebar} />
//         <div className="h-full p-4 bg-quilocoS overflow-clip bg-slate-100">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Main;
