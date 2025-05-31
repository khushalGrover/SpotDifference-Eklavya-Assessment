import { lazy } from "react";
const Home = lazy(() => import("@/pages/HomeScreen"));
const Admin = lazy(() => import("@/pages/AdminScreen"));
const Game = lazy(() => import("@/pages/GameScreen"));


export const appRoutes = [
  {
    path: "/",
      name: "home",
    element: <Home />,
  },
  {
    path: "/admin",
    name: "Admin",
    element: <Admin />,
  },
  {
    path: "/play",
    name: "Game",
    element: <Game />,
  }
];
