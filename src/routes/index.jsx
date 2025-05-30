import { lazy } from "react";
const Home = lazy(() => import("@/pages/HomeScreen"));
const About = lazy(() => import("@/pages/AboutScreen"));
const Game = lazy(() => import("@/pages/GameScreen"));


export const appRoutes = [
  {
    path: "/",
      name: "home",
    element: <Home />,
  },
  {
    path: "/about",
    name: "About",
    element: <About />,
  },
  {
    path: "/play",
    name: "Game",
    element: <Game />,
  }
];
