import React from "react";
import ReactDOM from "react-dom/client";
import { CreateIdentity } from "./CreateIdentity";
import {
  Outlet,
  RouterProvider,
  createRouter,
  createRoute,
  createRootRoute,
} from "@tanstack/react-router";
import CreateJWK from "./CreateJWK";

const root = document.querySelector("#root");

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: function Index() {
    return (
      <div className="mx-auto container mt-10 w-full">
        <CreateIdentity />
      </div>
    );
  },
});

const createJWKRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/create-jwk',
  component: CreateJWK,
})

const routeTree = rootRoute.addChildren([indexRoute, createJWKRoute]);

const router = createRouter({ routeTree });

if (root) {
  ReactDOM.createRoot(root as HTMLElement).render(
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  );
}
