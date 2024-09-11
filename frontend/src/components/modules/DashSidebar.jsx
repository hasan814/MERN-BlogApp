import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";
import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const DashSidebar = () => {
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
    <Sidebar className="w-full md:w-560">
      <SidebarItems>
        <SidebarItemGroup>
          <Link to={"/dashboard?tab=profile"}>
            <SidebarItem
              active={tab === "profile"}
              icon={HiUser}
              label={"User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </SidebarItem>
          </Link>
          <SidebarItem icon={HiArrowSmRight} className="cursor-pointer">
            Sign Out
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
};

export default DashSidebar;
