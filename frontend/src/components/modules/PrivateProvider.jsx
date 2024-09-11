import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateProvider = () => {
  // ================ Redux ===============
  const { currentUser } = useSelector((state) => state.user);

  // ================ Rendering ===============
  return currentUser ? <Outlet /> : <Navigate to={"/sign-in"} />;
};

export default PrivateProvider;
