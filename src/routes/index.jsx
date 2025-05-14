import { createBrowserRouter } from "react-router-dom";
import Auth from "../Layout/Auth/Auth";
import Main from "../Layout/Main/Main";
import Home from "../Pages/Dashboard/Home/Home";
import PrivacyPolicy from "../Pages/Dashboard/PrivacyPolicy/PrivacyPolicy.jsx";
import ChangePassword from "../Pages/Auth/ChangePassword";
import Login from "../Pages/Auth/Login";
import ForgotPassword from "../Pages/Auth/ForgotPassword";
import VerifyOtp from "../Pages/Auth/VerifyOtp";
import ResetPassword from "../Pages/Auth/ResetPassword";
import NotFound from "../NotFound";
import Notifications from "../Pages/Dashboard/Notifications";
import AdminProfile from "../Pages/Dashboard/AdminProfile/AdminProfile";
import TermsAndCondition from "../Pages/Dashboard/TermsAndCondition/TermsAndCondition";
import ServiceProvidersList from "../Pages/Dashboard/ServiceProvider/ServiceProvidersList.jsx";
import Transaction from "../Pages/Dashboard/Transaction/Transaction.jsx";
import Setting from "../Pages/Dashboard/Setting/Setting.jsx";
import Contact from "../Pages/Dashboard/Contact/Contact.jsx";
import Customer from "../Pages/Dashboard/Customer/Customer.jsx";
import PushNotification from "../Pages/Dashboard/PushNotification/PushNotification.jsx";
import UserManagement from "../Pages/Dashboard/Booking/UserManagement.jsx";
import CategoryList from "../Pages/Dashboard/Service/CategoryList/CategoryList.jsx";
import ServiceList from "../Pages/Dashboard/Service/ServiceList/ServiceList.jsx";
import SpecificService from "../Pages/Dashboard/DyanamicPage/SpecificService.jsx";
import SupportChat from "../Pages/Dashboard/SupportChat/SupportChat.jsx";
import Report from "../Pages/Dashboard/Report/Report.jsx";
import Slider from "../Pages/Dashboard/Slider/Slider.jsx";
import OnboardingScreeen from "../Pages/Dashboard/OnboardingScreen/OnboardingScreeen.jsx";
import UserDetails from "../components/users/UserDetails.jsx";
import SalesHistory from "../components/users/SalesHistory.jsx";
import BuyingHistory from "../components/users/BuyingHistory.jsx";
import ProductDetails from "../components/product/ProductDetails.jsx";
import ProductManagement from "../components/product/productManagement.jsx";
import AppReview from "../components/AppReview/AppReview.jsx";
import Category from "../components/category/Category.jsx";
import ChatList from "../Pages/Dashboard/SupportChat/ChatList.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/service-provider-list", element: <ServiceProvidersList /> },
      { path: "/product-details", element: <ProductManagement /> },
      { path: "/app-review", element: <AppReview /> },
      { path: "/product-details/:id", element: <ProductDetails /> },
      { path: "/category", element: <Category /> },
      { path: "/reported-issues", element: <Report /> },
      { path: "/customer-list", element: <Customer /> },
      { path: "/user-management", element: <UserManagement /> },
      { path: "/user-management/user-details/:id", element: <UserDetails /> },
      { path: "/user-management/sales-history", element: <SalesHistory /> },
      { path: "/user-management/buying-history", element: <BuyingHistory /> },
      { path: "/transaction", element: <Transaction /> },
      { path: "/support-chat", element: <SupportChat /> },
      {
        path: "/chat/:chatRoomId", 
        element: <SupportChat />, 
        children: [
          { path: ":chatRoomId", element: <ChatList /> }
        ],
      },
      { path: "/pushnotification", element: <PushNotification /> },
      { path: "/slider", element: <Slider /> },
      { path: "/onboarding-screen", element: <OnboardingScreeen /> },
      { path: "/contact", element: <Contact /> },
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
