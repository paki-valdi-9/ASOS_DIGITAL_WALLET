import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { Routess, store } from "app";
import { Toast } from "app";
import "index.css";
import "@atlaskit/css-reset";
import "react-credit-cards-2/dist/es/styles-compiled.css";

const App: React.FC = () => {
  const routing = useRoutes(Routess());
  return <>{routing}</>;
};

const container = document.getElementById("root");

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter basename={process.env.PUBLIC_URL + "/"}>
        <Toast />
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  container
);
