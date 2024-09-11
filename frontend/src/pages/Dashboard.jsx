import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import DashProfile from "../components/modules/DashProfile";
import DashSidebar from "../components/modules/DashSidebar";

const Dashboard = () => {
  // ============ Location =============
  const location = useLocation();

  // ============ State ===============
  const [tab, setTab] = useState("");

  // ============ Effect ===============
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFormUrl = urlParams.get("tab");
    if (tabFormUrl) setTab(tabFormUrl);
  }, [location.search]);

  // ============ Rendering ===============
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashSidebar />
      </div>
      <div className="">{tab === "profile" && <DashProfile />}</div>
    </div>
  );
};

export default Dashboard;
