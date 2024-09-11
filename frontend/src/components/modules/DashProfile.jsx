import { useEffect, useRef, useState, useCallback } from "react";
import { Alert, Button, TextInput, Spinner } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgressbar } from "react-circular-progressbar";
import { app } from "../../firebase";
import {
  updateStart,
  updateFailure,
  updateSuccess,
} from "../../redux/user/userSlice";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import toast from "react-hot-toast";
import "react-circular-progressbar/dist/styles.css";

const DashProfile = () => {
  const dispatch = useDispatch();

  // ============== Redux =============
  const { currentUser } = useSelector((state) => state.user);

  // ============== State =============
  const [formData, setFormData] = useState({
    username: currentUser?.username || "",
    email: currentUser?.email || "",
    profilePicture: currentUser?.profilePicture || "",
  });
  const [imageFile, setimageFile] = useState(null);
  const [imageFileUrl, setimageFileUrl] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ============== Ref ==============
  const filePickerRef = useRef();

  // ============== Memoized uploadImage ==============
  const uploadImage = useCallback(async () => {
    setImageFileUploadError(null);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imageFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        setImageFileUploadError("Image upload failed: " + error.message);
        setImageFileUploadProgress(null);
        setimageFile(null);
        setimageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setimageFileUrl(downloadURL);
          setFormData((prev) => ({ ...prev, profilePicture: downloadURL }));
        });
      }
    );
  }, [imageFile]);

  // ============== useEffect ==============
  useEffect(() => {
    if (imageFile) uploadImage();
  }, [imageFile, uploadImage]);

  // ============== Handlers ==============
  const imageChangeHandler = (event) => {
    const file = event.target.files[0];
    if (file) {
      setimageFile(file);
      setimageFileUrl(URL.createObjectURL(file));
    }
  };

  const changeHandler = (event) => {
    const { id, value } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (Object.keys(formData).length === 0) return;
    setIsSubmitting(true);
    try {
      dispatch(updateStart());
      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      if (!response.ok) {
        dispatch(updateFailure(responseData.message));
        toast.error(responseData.message);
      } else {
        dispatch(updateSuccess(responseData));
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      toast.error("Update failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============== Rendering ==============
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={submitHandler}>
        <input
          type="file"
          hidden
          accept="image/*"
          ref={filePickerRef}
          onChange={imageChangeHandler}
        />
        <div
          className="w-32 h-32 self-center cursor-pointer shadow-md overflow-hidden relative"
          onClick={() => filePickerRef.current.click()}
        >
          {imageFileUploadProgress && (
            <CircularProgressbar
              value={imageFileUploadProgress || 0}
              text={`${imageFileUploadProgress}%`}
              strokeWidth={5}
              styles={{
                root: {
                  width: "100%",
                  height: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                },
                path: {
                  stroke: `rgba(62, 152, 199, ${
                    imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            alt="user"
            src={imageFileUrl || currentUser.profilePicture}
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              imageFileUploadProgress &&
              imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {imageFileUploadError && (
          <Alert color="failure">{imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="Username..."
          onChange={changeHandler}
          value={formData.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email..."
          onChange={changeHandler}
          value={formData.email}
        />
        <TextInput
          type="password"
          id="password"
          placeholder="Enter new password..."
          onChange={changeHandler}
        />
        <Button
          type="submit"
          gradientDuoTone={"purpleToBlue"}
          outline
          disabled={isSubmitting}
        >
          {isSubmitting ? <Spinner size="sm" light /> : "Update"}
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span className="cursor-pointer">Delete Account</span>
        <span className="cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
};

export default DashProfile;
