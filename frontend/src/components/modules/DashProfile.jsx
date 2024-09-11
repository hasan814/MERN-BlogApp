import { useEffect, useRef, useState } from "react";
import { Alert, Button, TextInput } from "flowbite-react";
import { CircularProgressbar } from "react-circular-progressbar";
import { useSelector } from "react-redux";
import { app } from "../../firebase";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

import "react-circular-progressbar/dist/styles.css";

const DashProfile = () => {
  // ============== State =============
  const [imageFile, setimageFile] = useState(null);
  const [imageFileUrl, setimageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);

  // ============== Ref =============
  const filePickerRef = useRef();

  // ============== Redux =============
  const { currentUser } = useSelector((state) => state.user);

  // ============== Function =============
  const imageChangeHandler = (event) => {
    const file = event.target.files[0];
    if (file) {
      setimageFile(file);
      setimageFileUrl(URL.createObjectURL(file));
    }
  };

  // ============== Function =============
  const uploadImage = async () => {
    // service firebase.storage {
    //   match /b/{bucket}/o {
    //     match /{allPaths=**} {
    //       allow read;
    //       allow write:if
    //       request.resource.size<2*1024*1024 &&
    //       request.resource.contentType.matches('image/.*')
    //     }
    //   }
    // }
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
        setImageFileUploadError(
          "Could not  upload image (File must be less than 2MB"
        );
        setImageFileUploadProgress(null);
        setimageFile(null);
        setimageFileUrl(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setimageFileUrl(downloadURL);
        });
      }
    );
  };

  // ============== Effect =============
  useEffect(() => {
    if (imageFile) uploadImage();
  }, [imageFile]);

  // ============== Rendering =============
  return (
    <div className="max-w-lg mx-auto p-3 w-full">
      <h1 className="my-7 text-center font-semibold text-3xl">Profile</h1>
      <form className="flex flex-col gap-4">
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
        {imageFileUploadError && <Alert color="failure">{}</Alert>}
        <TextInput
          type="text"
          id="username"
          placeholder="Username..."
          defaultValue={currentUser.username}
        />
        <TextInput
          type="email"
          id="email"
          placeholder="Email..."
          defaultValue={currentUser.email}
        />
        <TextInput
          type="text"
          id="password"
          placeholder="Password..."
          defaultValue="***************"
        />
        <Button type="password" gradientDuoTone={"purpleToBlue"} outline>
          Update
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
