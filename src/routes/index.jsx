import { createBrowserRouter } from "react-router-dom";
import AppReview from "../components/AppReview/AppReview.jsx";
import ProductDetails from "../components/product/ProductDetails.jsx";
import ProductManagement from "../components/product/productManagement.jsx";
import BuyingHistory from "../components/users/BuyingHistory.jsx";
import SalesHistory from "../components/users/SalesHistory.jsx";
import UserDetails from "../components/users/UserDetails.jsx";
import Auth from "../Layout/Auth/Auth";
import Main from "../Layout/Main/Main";
import NotFound from "../NotFound";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import Login from "../Pages/Auth/Login";
import ResetPassword from "../Pages/Auth/ResetPassword";
import VerifyOtp from "../Pages/Auth/VerifyOtp";
import About from "../Pages/Dashboard/About/About.jsx";
import AdminProfile from "../Pages/Dashboard/AdminProfile/AdminProfile";
import UserManagement from "../Pages/Dashboard/Booking/UserManagement.jsx";
import Contact from "../Pages/Dashboard/Contact/Contact.jsx";
import Customer from "../Pages/Dashboard/Customer/Customer.jsx";
import SpecificService from "../Pages/Dashboard/DyanamicPage/SpecificService.jsx";
import Home from "../Pages/Dashboard/Home/Home";
import Notifications from "../Pages/Dashboard/Notifications";
import PrivacyPolicy from "../Pages/Dashboard/PrivacyPolicy/PrivacyPolicy.jsx";
import PushNotification from "../Pages/Dashboard/PushNotification/PushNotification.jsx";
import Report from "../Pages/Dashboard/Report/Report.jsx";
import CategoryList from "../Pages/Dashboard/Service/CategoryList/CategoryList.jsx";
import ServiceList from "../Pages/Dashboard/Service/ServiceList/ServiceList.jsx";
import ServiceProvidersList from "../Pages/Dashboard/ServiceProvider/ServiceProvidersList.jsx";
import Setting from "../Pages/Dashboard/Setting/Setting.jsx";
import Slider from "../Pages/Dashboard/Slider/Slider.jsx";
import ChatList from "../Pages/Dashboard/SupportChat/ChatList.jsx";
import SupportChat from "../Pages/Dashboard/SupportChat/SupportChat.jsx";
import TermsAndCondition from "../Pages/Dashboard/TermsAndCondition/TermsAndCondition";
import Transaction from "../Pages/Dashboard/Transaction/Transaction.jsx";
import Video from "../Pages/Dashboard/Video/Video.jsx";
import ProtectedRoute from "./ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute> <Main /> </ProtectedRoute>,
    children: [
      { path: "/", element: <Home /> },
      { path: "/service-provider-list", element: <ServiceProvidersList /> },
      { path: "/product-details", element: <ProductManagement /> },
      { path: "/app-review", element: <AppReview /> },
      { path: "/product-details/:id", element: <ProductDetails /> },
      // { path: "/category", element: <Category /> },
      { path: "/reported-issues", element: <Report /> },
      { path: "/customer-list", element: <Customer /> },
      { path: "/user-management", element: <UserManagement /> },
      { path: "/user-management/user-details/:id", element: <UserDetails /> },
      { path: "/user-management/sales-history", element: <SalesHistory /> },
      { path: "/user-management/buying-history", element: <BuyingHistory /> },
      { path: "/transaction", element: <Transaction /> },
      { path: "", element: <SupportChat /> },
      {
        path: "/support-chat",
        element: <SupportChat />,
        children: [
          { path: "chat/:chatRoomId", element: <SupportChat /> },  // relative path, no leading slash
          { path: ":chatRoomId", element: <ChatList /> }
        ],
      },

      { path: "/pushnotification", element: <PushNotification /> },
      { path: "/slider", element: <Slider /> },
      { path: "/video", element: <Video /> },
      { path: "/contact", element: <Contact /> },
      { path: "/about-us", element: <About /> },
      { path: "/privacy-policy", element: <PrivacyPolicy /> },
      { path: "/terms-and-conditions", element: <TermsAndCondition /> },
      { path: "/:serviceType-services", element: <SpecificService /> },
      { path: "/profile", element: <AdminProfile /> },
      { path: "/notification", element: <Notifications /> },
      { path: "/admin-list", element: <Setting /> },
      { path: "/category-list", element: <CategoryList /> },
      { path: "/service-list", element: <ServiceList /> },
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
    children: [
      { path: "/auth", element: <Login /> },
      { path: "login", element: <Login /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "verify-otp", element: <VerifyOtp /> },
      { path: "reset-password", element: <ResetPassword /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
