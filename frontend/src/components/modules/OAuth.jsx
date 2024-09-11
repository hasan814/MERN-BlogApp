import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { AiFillGoogleCircle } from "react-icons/ai";
import { signInSuccess } from "../../redux/user/userSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "flowbite-react";
import { app } from "../../firebase";

import toast from "react-hot-toast";

const OAuth = () => {
  // ============ Navigate ===============
  const navigate = useNavigate();

  // ============ Dispatch ===============
  const dispatch = useDispatch();

  // ============ Auth ===============
  const auth = getAuth(app);

  // ============ Function ===============
  const googleClickHandler = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });
    try {
      const resultsFormGoogle = await signInWithPopup(auth, provider);
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: resultsFormGoogle.user.displayName,
          email: resultsFormGoogle.user.email,
          googlePhotoUrl: resultsFormGoogle.user.photoURL,
        }),
      });
      const responseData = await response.json();
      if (response.ok) {
        dispatch(signInSuccess(responseData));
        toast.success("Signin with Google Successfully");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ============ Rendering ===============
  return (
    <Button
      outline
      type="button"
      onClick={googleClickHandler}
      gradientDuoTone={"pinkToOrange"}
    >
      <AiFillGoogleCircle className="w-6 h-6 mr-2" />
      Continue with Google
    </Button>
  );
};

export default OAuth;
