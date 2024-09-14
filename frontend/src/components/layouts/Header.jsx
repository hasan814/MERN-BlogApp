import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { signoutSuccess } from "../../redux/user/userSlice";
import { FaMoon, FaSun } from "react-icons/fa";
import { toggleTheme } from "../../redux/theme/themeSlice";

import toast from "react-hot-toast";

import {
  Avatar,
  Button,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarCollapse,
  NavbarLink,
  TextInput,
} from "flowbite-react";

const Header = () => {
  // ================= Navigate ================
  const navigate = useNavigate();

  // ================= Location ================
  const path = useLocation().pathname;
  const location = useLocation();

  // ================= State ================
  const [searchTerm, setSearchTerm] = useState("");

  // ================= Dispatch ================
  const dispatch = useDispatch();

  // ================= Redux Toolkit ================
  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);

  // ================= Function ================
  const signoutHandler = async () => {
    try {
      const response = await fetch("/api/user/signout", {
        method: "POST",
      });
      const responseData = await response.json();
      if (!response.ok) toast.error(responseData.message);
      else toast.success("Sign Out Successfully"), dispatch(signoutSuccess());
    } catch (error) {
      toast.error(error);
    }
  };

  // ================= Effect ================
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFormUrl = urlParams.get("searchTerm");
    if (searchTermFormUrl) setSearchTerm(searchTermFormUrl);
  }, [location.search]);

  // ================= Search function ================
  const searchSubmitHandler = async (event) => {
    event.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  // ================= Rendering ================
  return (
    <div>
      <Navbar className="border-b-2">
        <Link
          to={"/"}
          className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
        >
          <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
            Blog App
          </span>
        </Link>
        <form onSubmit={searchSubmitHandler}>
          <TextInput
            type="text"
            value={searchTerm}
            placeholder="Search..."
            rightIcon={AiOutlineSearch}
            className="hidden lg:inline"
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </form>
        <Button className="w-12 h-10 lg:hidden" color="gray" pill>
          <AiOutlineSearch />
        </Button>
        <div className="flex gap-2 md:order-2">
          <Button
            pill
            color="gray"
            onClick={() => dispatch(toggleTheme())}
            className="w-12 h-10 hidden sm:inline"
          >
            {theme === "light" ? <FaMoon /> : <FaSun />}
          </Button>
          {currentUser ? (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar alt="user" img={currentUser.profilePicture} rounded />
              }
            >
              <DropdownHeader>
                <span className="block text-sm">{currentUser.username}</span>
                <span className="block text-sm font-medium truncate">
                  {currentUser.email}
                </span>
              </DropdownHeader>
              <Link to={"/dashboard?tab=profile"}>
                <DropdownItem>Profile</DropdownItem>
                <DropdownDivider />
                <DropdownItem onClick={signoutHandler}>Sign Out</DropdownItem>
              </Link>
            </Dropdown>
          ) : (
            <Link to={"/sign-in"}>
              <Button gradientDuoTone={"purpleToBlue"} outline>
                Sign In
              </Button>
            </Link>
          )}
          <Navbar.Toggle />
        </div>
        <NavbarCollapse>
          <NavbarLink active={path === "/"} as={"div"}>
            <Link to="/">Home</Link>
          </NavbarLink>
          <NavbarLink active={path === "/about"} as={"div"}>
            <Link to="/about">About</Link>
          </NavbarLink>
          <NavbarLink active={path === "/projects"} as={"div"}>
            <Link to="/projects">Projects</Link>
          </NavbarLink>
        </NavbarCollapse>
      </Navbar>
    </div>
  );
};

export default Header;
