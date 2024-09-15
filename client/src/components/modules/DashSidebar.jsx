import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { signoutSuccess } from "../../redux/user/userSlice";

import toast from "react-hot-toast";

import {
  HiAnnotation,
  HiArrowSmRight,
  HiChartPie,
  HiDocumentText,
  HiOutlineUserGroup,
  HiUser,
} from "react-icons/hi";

import {
  Sidebar,
  SidebarItem,
  SidebarItemGroup,
  SidebarItems,
} from "flowbite-react";

const DashSidebar = () => {
  // ============ Redux =============
  const { currentUser } = useSelector((state) => state.user);

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
        <SidebarItemGroup className="flex flex-col gap-1">
          {currentUser && currentUser.isAdmin && (
            <Link to={"/dashboard?tab=dashboard"}>
              <SidebarItem
                active={tab === "dashboard" || !tab}
                icon={HiChartPie}
                as="div"
              >
                Dashboard
              </SidebarItem>
            </Link>
          )}
          <Link to={"/dashboard?tab=profile"}>
            <SidebarItem
              active={tab === "profile"}
              icon={HiUser}
              label={currentUser.isAdmin ? "Admin" : "User"}
              labelColor="dark"
              as="div"
            >
              Profile
            </SidebarItem>
          </Link>
          {currentUser.isAdmin && (
            <>
              <Link to={"/dashboard?tab=posts"}>
                <SidebarItem
                  active={tab === "posts"}
                  icon={HiDocumentText}
                  as="div"
                >
                  Posts
                </SidebarItem>
              </Link>
              <Link to={"/dashboard?tab=users"}>
                <SidebarItem
                  active={tab === "users"}
                  icon={HiOutlineUserGroup}
                  as="div"
                >
                  Users
                </SidebarItem>
              </Link>
              <Link to={"/dashboard?tab=comments"}>
                <SidebarItem
                  active={tab === "users"}
                  icon={HiAnnotation}
                  as="div"
                >
                  Comments
                </SidebarItem>
              </Link>
            </>
          )}
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
