import React from "react";
import ReactDOM from "react-dom/client";
import { CreateIdentity } from "./CreateIdentity";

const root = document.querySelector("#root");

const AppRoot = () => {
  return (
    <React.StrictMode>
      <div className="mx-auto container mt-10 w-full">
        <CreateIdentity />
      </div>
    </React.StrictMode>
  );
};

if (root) {
  ReactDOM.createRoot(root as HTMLElement).render(<AppRoot />);
}
