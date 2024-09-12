import { useEffect, useRef, useState, useCallback } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgressbar } from "react-circular-progressbar";
import { app } from "../../firebase";
import {
  Alert,
  Button,
  TextInput,
  Spinner,
  Modal,
  ModalHeader,
  ModalBody,
} from "flowbite-react";

import {
  updateStart,
  updateFailure,
  updateSuccess,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  signoutSuccess,
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
  // ============== Dispatch ===============
  const dispatch = useDispatch();

  // ============== Redux ===============
  const { currentUser } = useSelector((state) => state.user);

  // ============== State ===============
  const [state, setState] = useState({
    imageFile: null,
    imageFileUrl: currentUser?.profilePicture || "",
    showModal: false,
    isSubmitting: false,
    imageFileUploadError: null,
    imageFileUploadProgress: null,
    formData: {
      username: currentUser?.username || "",
      email: currentUser?.email || "",
      profilePicture: currentUser?.profilePicture || "",
    },
  });

  // ============== Ref ===============
  const filePickerRef = useRef();

  // ============== Callback Function ===============
  const uploadImage = useCallback(async () => {
    setState((prev) => ({ ...prev, imageFileUploadError: null }));
    const storage = getStorage(app);
    const fileName = `${new Date().getTime()}_${state.imageFile.name}`;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, state.imageFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setState((prev) => ({
          ...prev,
          imageFileUploadProgress: progress.toFixed(0),
        }));
      },
      (error) => {
        setState({
          imageFileUploadError: `Image upload failed: ${error.message}`,
          imageFileUploadProgress: null,
          imageFile: null,
          imageFileUrl: null,
        });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setState((prev) => ({
            ...prev,
            imageFileUrl: downloadURL,
            formData: { ...prev.formData, profilePicture: downloadURL },
          }));
        });
      }
    );
  }, [state.imageFile]);

  // ============== Effect Function ===============
  useEffect(() => {
    if (state.imageFile) uploadImage();
  }, [state.imageFile, uploadImage]);

  // ============== Image Function ===============
  const imageChangeHandler = (event) => {
    const file = event.target.files[0];
    if (file) {
      setState((prev) => ({
        ...prev,
        imageFile: file,
        imageFileUrl: URL.createObjectURL(file),
      }));
    }
  };

  // ============== Change Function ===============
  const changeHandler = (event) => {
    const { id, value } = event.target;
    setState((prev) => ({
      ...prev,
      formData: { ...prev.formData, [id]: value },
    }));
  };

  // ============== Submit Function ===============
  const submitHandler = async (event) => {
    event.preventDefault();
    if (Object.keys(state.formData).length === 0) return;
    setState((prev) => ({ ...prev, isSubmitting: true }));

    try {
      dispatch(updateStart());
      const response = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state.formData),
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
      toast.error(`Update failed: ${error.message}`);
    } finally {
      setState((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  // ============== Delete Function ===============
  const deleteUserHandler = async () => {
    setState((prev) => ({ ...prev, showModal: false }));
    try {
      dispatch(deleteUserStart());
      const response = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const responseData = await response.json();
      if (!response.ok) {
        dispatch(deleteUserFailure(responseData.message));
      } else {
        dispatch(deleteUserSuccess(responseData.message));
        toast.success("Profile Deleted Successfully");
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  // ============== Sign Out Function ===============
  const signoutHandler = async () => {
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

  // ============== Rendering ===============
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
          {state.imageFileUploadProgress && (
            <CircularProgressbar
              value={state.imageFileUploadProgress || 0}
              text={`${state.imageFileUploadProgress}%`}
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
                    state.imageFileUploadProgress / 100
                  })`,
                },
              }}
            />
          )}
          <img
            alt="user"
            src={state.imageFileUrl || currentUser.profilePicture}
            className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${
              state.imageFileUploadProgress &&
              state.imageFileUploadProgress < 100 &&
              "opacity-60"
            }`}
          />
        </div>
        {state.imageFileUploadError && (
          <Alert color="failure">{state.imageFileUploadError}</Alert>
        )}
        <TextInput
          type="text"
          id="username"
          placeholder="Username..."
          onChange={changeHandler}
          value={state.formData.username}
        />
        <TextInput
          id="email"
          type="email"
          placeholder="Email..."
          onChange={changeHandler}
          value={state.formData.email}
        />
        <TextInput
          id="password"
          type="password"
          onChange={changeHandler}
          placeholder="Enter new password..."
        />
        <Button
          outline
          type="submit"
          disabled={state.isSubmitting}
          gradientDuoTone={"purpleToBlue"}
        >
          {state.isSubmitting ? <Spinner size="sm" light /> : "Update"}
        </Button>
      </form>
      <div className="text-red-500 flex justify-between mt-5">
        <span
          className="cursor-pointer"
          onClick={() => setState((prev) => ({ ...prev, showModal: true }))}
        >
          Delete Account
        </span>
        <span onClick={signoutHandler} className="cursor-pointer">
          Sign Out
        </span>
      </div>
      <Modal
        show={state.showModal}
        onClose={() => setState((prev) => ({ ...prev, showModal: false }))}
        popup
        size="md"
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete your account?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color={"failure"} onClick={deleteUserHandler}>
                Yes, I&apos;m sure
              </Button>
              <Button
                color={"gray"}
                onClick={() =>
                  setState((prev) => ({ ...prev, showModal: false }))
                }
              >
                No, Cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default DashProfile;
