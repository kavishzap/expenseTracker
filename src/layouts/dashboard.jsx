import { Routes, Route } from "react-router-dom";
import {
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";
import { useMaterialTailwindController, setOpenConfigurator } from "@/context";

const backgroundStyle = {
  backgroundImage: "radial-gradient(circle, #454545, transparent 1px)",
  backgroundSize: "10px 10px",
  padding: "0 1rem",
};

export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();

  return (
    <div className="p-10" style={backgroundStyle}>
      <div className="p-4">
        <Routes>
          {routes.map(
            ({ layout, pages }) =>
              layout === "dashboard" &&
              pages.map(({ path, element }) => (
                <Route exact path={path} element={element} />
              ))
          )}
        </Routes>
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
