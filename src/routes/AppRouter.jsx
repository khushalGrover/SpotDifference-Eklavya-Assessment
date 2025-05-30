import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { appRoutes } from "@/routes/index";

const AppRouter = (props) => {
  return (
    <Routes>
      {(appRoutes || []).map((route, idx) => (
        <Route
          key={idx + route.name}
          path={route.path}
          element={<Suspense {...props}>{route.element}</Suspense>}
        />
      ))}
    </Routes>
  );
};

export default AppRouter;
