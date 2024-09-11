import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import {
  signInFailure,
  signInStart,
  signInSuccess,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import OAuth from "../components/modules/OAuth";

const SignIn = () => {
  // ============ Dispatch ============
  const dispatch = useDispatch();

  // ============ Navigate ============
  const navigate = useNavigate();

  // ============= State ============
  const [formData, setformData] = useState({});

  // ============ Selector ============
  const { loading, error: errorMessage } = useSelector((state) => state.user);
  // ============ Function ============
  const changeHandler = (event) => {
    const { id, value } = event.target;
    setformData({ ...formData, [id]: value.trim() });
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!formData.email || !formData.password)
      return dispatch(signInFailure("Please fill out all fields."));
    try {
      dispatch(signInStart());
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      if (responseData.success === false) {
        dispatch(signInFailure(responseData.message));
      }
      if (response.ok) {
        toast.success(responseData.message);
        dispatch(signInSuccess(responseData.user));
        navigate("/");
      }
    } catch (error) {
      console.log("error", error);
      dispatch(signInFailure(error.message));
    }
  };

  // ============ Rendering ============
  return (
    <div className="mt-20 min-h-screen">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <Link to={"/"} className=" text-4xl font-bold dark:text-white">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              Blog App
            </span>
          </Link>
          <p className="text-sm mt-5">
            You can sign in with your email and password
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4" onSubmit={submitHandler}>
            <div>
              <Label value="Your Email" />
              <TextInput
                type="email"
                id="email"
                placeholder="Email..."
                onChange={changeHandler}
              />
            </div>
            <div>
              <Label value="Your Password" />
              <TextInput
                type="password"
                id="password"
                placeholder="**********"
                onChange={changeHandler}
              />
            </div>
            <Button
              gradientDuoTone="purpleToPink"
              type="submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size={"sm"} />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                "Sign In"
              )}
            </Button>
            <OAuth />
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Don&apos;t Have an Account?</span>
            <Link to={"/sign-up"} className="text-blue-500">
              Sign Up
            </Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color={"failure"}>
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignIn;
