import { ConfigProvider, Spin } from "antd";
import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { Toaster } from 'react-hot-toast';
import { Provider } from "react-redux";
import "./index.css";
import { store } from "./utils/store.js";

const App = lazy(() => import('./App.jsx'));

// Custom theme configuration
const theme = {
  token: {
    colorPrimary: '#FF6610',
  },
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <ConfigProvider theme={theme}>
        <Suspense fallback={<div className="flex justify-center items-center h-[400px]"><Spin size="default" /></div>}>
          <App />
        </Suspense>
        <Toaster />
      </ConfigProvider>
    </Provider>
  </React.StrictMode>
);