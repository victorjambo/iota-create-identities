import React from "react";
import ReactDOM from "react-dom/client";
import { CreateIdentity } from "./CreateIdentity";
import CreateJWK from "./CreateJWK";

const App = () => {
  return (
    <div className="mx-auto container mt-10 w-full">
      {globalThis.location.hash === "#create-jwk" ? (
        <CreateJWK />
      ) : (
        <CreateIdentity />
      )}
    </div>
  );
};

const root = document.querySelector("#root");

if (root) {
  ReactDOM.createRoot(root as HTMLElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
