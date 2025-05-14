import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";



import { Spin } from "antd";
import { Toaster } from 'react-hot-toast';
import { Provider } from "react-redux";
import "./index.css";
import { store } from "./utils/store.js";

const App = lazy(() => import('./App.jsx'))


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <Suspense fallback={<div className="flex justify-center items-center h-[400px]"><Spin size="default" /></div>}>
        <App />
      </Suspense>
      <Toaster />
    </Provider>

  </React.StrictMode>
);
