import { HiArrowSmRight, HiUser } from "react-icons/hi";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../../redux/user/userSlice";
import { useDispatch } from "react-redux";

import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";

import toast from "react-hot-toast";

const DashSidebar = () => {
  // ============ Dispatch =============
  const dispatch = useDispatch();

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

  // ============== Sign Out Function ===============
  const signOutHandler = async () => {
    try {
      const response = await fetch("/api/user/signout", {
        method: "POST",
      });
      const responseData = await response.json();
      if (!response.ok) toast.error(responseData.message);
      else {
        toast.success("Sign Out Successfully");
        dispatch(signoutSuccess());
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
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
          <SidebarItem
            icon={HiArrowSmRight}
            onClick={signOutHandler}
            className="cursor-pointer"
          >
            Sign Out
          </SidebarItem>
        </SidebarItemGroup>
      </SidebarItems>
    </Sidebar>
  );
};

export default DashSidebar;
