import { Alert, Button, FileInput, Select, TextInput } from "flowbite-react";
import { useNavigate, useParams } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
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

const UpdatePost = () => {
  // =============== Redux =============
  const { currentUser } = useSelector((state) => state.user);

  // =============== Params =============
  const { postId } = useParams();

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
      const response = await fetch(
        `/api/post/updatepost/${formData._id}/${currentUser._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const responseData = await response.json();
      if (!response.ok) {
        setPublishError(responseData.message);
        return;
      }
      if (response.ok) {
        setPublishError(null);
        navigate(`/post/${responseData.slug}`);
        toast.success("Post Updated Successfully");
      }
    } catch (error) {
      console.log(error);
      setPublishError(null);
    }
  };

  // =============== Effect =============
  useEffect(() => {
    try {
      const fetchPost = async () => {
        const response = await fetch(`/api/post/getposts?postId=${postId}`);
        const responseData = await response.json();
        if (!response.ok) {
          setPublishError(responseData.message);
          return;
        }
        if (response.ok) {
          setPublishError(null);
          setFormData(responseData.posts[0]);
        }
      };

      fetchPost();
    } catch (error) {
      console.log(error.message);
    }
  }, [postId]);

  // Framer Motion Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    visible: {
      transition: { staggerChildren: 0.2 },
    },
  };

  // =============== Rendering =============
  return (
    <motion.div
      className="p-3 max-w-3xl mx-auto min-h-screen"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.h1
        className="text-center text-3xl my-7 font-semibold"
        variants={fadeInUp}
      >
        Update Post
      </motion.h1>
      <form className="flex flex-col gap-4" onSubmit={submitHandler}>
        <motion.div
          className="flex flex-col gap-4 sm:flex-row justify-between"
          variants={fadeInUp}
        >
          <TextInput
            required
            id="title"
            type="text"
            className="flex-1"
            placeholder="Title"
            value={formData.title}
            onChange={(event) =>
              setFormData({ ...formData, title: event.target.value })
            }
          />
          <Select
            value={formData.category}
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
        </motion.div>
        <motion.div
          className="flex gap-4 items-center justify-between border-4 border-teal-500 border-dotted p-3"
          variants={fadeInUp}
        >
          <FileInput
            type="file"
            accept="image/*"
            onChange={(event) => setFile(event.target.files[0])}
          />
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
        {imageUploadError && <Alert color="failure">{imageUploadError}</Alert>}
        {formData.image && (
          <motion.img
            src={formData.image}
            alt="upload"
            className="w-full h-72 object-cover"
            variants={fadeInUp}
          />
        )}
        <ReactQuill
          required
          theme="snow"
          value={formData.content}
          className="h-72 mb-12"
          placeholder="Write Something..."
          onChange={(value) => {
            setFormData({ ...formData, content: value });
          }}
        />
        <Button type="submit" gradientDuoTone={"purpleToPink"}>
          Update Post
        </Button>
        {publishError && <Alert color={"failure"}>{publishError}</Alert>}
      </form>
    </motion.div>
  );
};

export default UpdatePost;
