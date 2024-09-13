import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import OnlyAdminPrivateRoute from "./components/modules/OnlyAdminPrivateRoute";
import PrivateProvider from "./components/modules/PrivateProvider";
import ScrollToTop from "./components/modules/ScrollToTop";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import Dashboard from "./pages/Dashboard";
import FooterCom from "./components/layouts/FooterCom";
import PostPage from "./pages/PostPage";
import Projects from "./pages/Projects";
import Header from "./components/layouts/Header";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Home from "./pages/Home";

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Toaster />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route element={<PrivateProvider />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<OnlyAdminPrivateRoute />}>
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
        <Route path="/projects" element={<Projects />} />
        <Route path="/post/:postSlug" element={<PostPage />} />
      </Routes>
      <FooterCom />
    </BrowserRouter>
  );
};

export default App;
