import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const OnlyAdminPrivateRoute = () => {
  // ================ Redux ===============
  const { currentUser } = useSelector((state) => state.user);

  // ================ Rendering ===============
  return currentUser && currentUser.isAdmin ? (
    <Outlet />
  ) : (
    <Navigate to={"/sign-in"} />
  );
};

export default OnlyAdminPrivateRoute;
