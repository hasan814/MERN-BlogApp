import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import DashSidebar from "../components/modules/DashSidebar";
import DashProfile from "../components/modules/DashProfile";
import DashComment from "../components/modules/DashComment";
import DashUsers from "../components/modules/DashUsers";
import DashPost from "../components/modules/DashPost";

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
      {tab === "profile" && <DashProfile />}
      {tab === "posts" && <DashPost />}
      {tab === "users" && <DashUsers />}
      {tab === "comments" && <DashComment />}
    </div>
  );
};

export default Dashboard;
