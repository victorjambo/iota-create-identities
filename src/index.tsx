import React from "react";
import ReactDOM from "react-dom/client";

const root = document.querySelector("#root");

const AppRoot = () => {
  return (
    <React.StrictMode>
      <div>Hello world</div>
    </React.StrictMode>
  );
};

if (root) {
  ReactDOM.createRoot(root as HTMLElement).render(<AppRoot />);
}
