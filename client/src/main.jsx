import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./redux/store.js";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import { BrowserRouter } from 'react-router-dom'
ReactDOM.createRoot(document.getElementById("root")).render(
  //   <BrowserRouter>
  <Provider store={store}>
    <ToastContainer />
    <App />
  </Provider>
  //   </BrowserRouter>
);
