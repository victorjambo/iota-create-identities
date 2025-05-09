import React from "react";
import ReactDOM from "react-dom/client";
import { CreateIdentity } from "./CreateIdentity";

const root = document.querySelector("#root");

const AppRoot = () => {
  return (
    <React.StrictMode>
      <CreateIdentity />
    </React.StrictMode>
  );
};

if (root) {
  ReactDOM.createRoot(root as HTMLElement).render(<AppRoot />);
}
