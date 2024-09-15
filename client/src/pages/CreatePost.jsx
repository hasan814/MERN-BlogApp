import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { CircularProgressbar } from "react-circular-progressbar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion"; // Import motion from framer-motion
import { app } from "../firebase";

import ReactQuill from "react-quill";
import toast from "react-hot-toast";
import "react-quill/dist/quill.snow.css";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";

const CreatePost = () => {
  // =============== Navigate =============
  const navigate = useNavigate();

  // =============== State =============
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);

  // =============== Image Function =============
  const imageUploadHandler = async () => {
    try {
      if (!file) {
        setImageUploadError("Please select an Image");
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + "-" + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0));
        },
        (error) => {
          console.log(error);
          setImageUploadError("Image Upload Failed");
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, image: downloadURL });
          });
        }
      );
    } catch (error) {
      setImageUploadError("Image upload failed");
      setImageUploadProgress(null);
      console.log(error);
    }
  };

  // =============== Submit Function =============
  const submitHandler = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/post/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();
      if (!response.ok) {
        setPublishError(responseData.message);
        return;
      }
      if (response.ok) {
        setPublishError(null);
        navigate(`/post/${responseData.slug}`);
        toast.success("Post Published Succesfully");
      }
    } catch (error) {
      console.log(error);
      setPublishError(null);
    }
  };

  // Animation Variants
  const fadeIn = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const buttonAnimation = {
    hidden: { scale: 0 },
    visible: { scale: 1, transition: { duration: 0.3 } },
  };

  // =============== Rendering =============
  return (
    <motion.div
      className="p-3 max-w-3xl mx-auto min-h-screen"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <motion.h1
        className="text-center text-3xl my-7 font-semibold"
        variants={fadeIn}
      >
        Create a Post
      </motion.h1>
      <motion.form
        className="flex flex-col gap-4"
        onSubmit={submitHandler}
        initial="hidden"
        animate="visible"
        variants={fadeIn}
      >
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            required
            id="title"
            type="text"
            className="flex-1"
            placeholder="Title"
            onChange={(event) =>
              setFormData({ ...formData, title: event.target.value })
            }
          />
          <Select
            onChange={(event) =>
              setFormData({ ...formData, category: event.target.value })
            }
          >
            <option value="uncategorized">Select a Category</option>
            <option value="javascript">JavaScript</option>
            <option value="reactjs">React.js</option>
            <option value="nextjs">API Development</option>
            <option value="nextjs">Web Design</option>
            <option value="nextjs">Full-Stack</option>
            <option value="nextjs">TypeScript</option>
            <option value="nextjs">Security</option>
            <option value="nextjs">Next.js</option>
            <option value="nextjs">Node.js</option>
            <option value="nextjs">Cloud</option>
            <option value="nextjs">CSS</option>
          </Select>
        </div>
        <div className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3">
          <FileInput
            type="file"
            accept="image/*"
            onChange={(event) => setFile(event.target.files[0])}
          />
          <motion.div
            variants={buttonAnimation}
            initial="hidden"
            animate="visible"
          >
            <Button
              outline
              size="sm"
              type="button"
              disabled={imageUploadProgress}
              onClick={imageUploadHandler}
              gradientDuoTone="purpleToBlue"
            >
              {imageUploadProgress ? (
                <div className="w-16 h-16">
                  <CircularProgressbar
                    value={imageUploadProgress}
                    text={`${imageUploadProgress || 0}%`}
                  />
                </div>
              ) : (
                "Upload Image"
              )}
            </Button>
          </motion.div>
        </div>
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
          />
        )}
        <ReactQuill
          required
          theme="snow"
          className="h-72 mb-12"
          placeholder="Write Something..."
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <motion.div
          variants={buttonAnimation}
          initial="hidden"
          animate="visible"
        >
          <Button type="submit" gradientDuoTone={"purpleToPink"}>
            Publish
          </Button>
        </motion.div>
        {publishError && <Alert color={"failure"}>{publishError}</Alert>}
      </motion.form>
    </motion.div>
  );
};

export default CreatePost;
