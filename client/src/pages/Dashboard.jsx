import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion"; // Import framer-motion

import DashboardPage from "../components/modules/DashboardPage";
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

  // Animation Variants for fade-in effect
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  // ============ Rendering ===============
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="md:w-56">
        <DashSidebar />
      </div>
      <motion.div
        key={tab}
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={fadeIn}
        className="flex-1"
      >
        {tab === "dashboard" && <DashboardPage />}
        {tab === "profile" && <DashProfile />}
        {tab === "posts" && <DashPost />}
        {tab === "users" && <DashUsers />}
        {tab === "comments" && <DashComment />}
      </motion.div>
    </div>
  );
};

export default Dashboard;
