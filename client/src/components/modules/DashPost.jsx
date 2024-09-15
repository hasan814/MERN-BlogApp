import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { DotLoader } from "react-spinners";
import toast from "react-hot-toast";

import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";

const DashPost = () => {
  // ==================== State ==============
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");

  // ==================== Redux ==============
  const { currentUser } = useSelector((state) => state.user);

  // ==================== Effect ==============
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch(
          `/api/post/getposts?userId=${currentUser._id}`
        );
        const responseData = await response.json();
        if (response.ok) {
          setUserPosts(responseData.posts);
          if (responseData.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) fetchPosts();
  }, [currentUser._id, currentUser.isAdmin]);

  // ==================== Function ==============
  const showMoreHandler = async () => {
    const startIndex = userPosts.length;
    try {
      const response = await fetch(
        `/api/post/getposts?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const responseData = await response.json();
      if (response.ok) {
        setUserPosts((prev) => [...prev, ...responseData.posts]);
        if (responseData.posts.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const deletePostHandler = async () => {
    setShowModal(false);
    try {
      const response = await fetch(
        `/api/post/deletepost/${postIdToDelete}/${currentUser._id}`,
        { method: "DELETE" }
      );
      const responseData = await response.json();
      if (!response.ok) {
        console.log(responseData.message);
      } else {
        setUserPosts((prev) =>
          prev.filter((post) => post._id !== postIdToDelete)
        );
        toast.success("Post Deleted Successfully");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ==================== Rendering ==============
  return (
    <div
      className="
            p-3
            scrollbar
            md:mx-auto
            table-auto
            overflow-x-scroll
            scrollbar-track-slate-100
            scrollbar-thumb-slate-300
            dark:scrollbar-track-slate-700
            dark:scrollbar-thumb-slate-500 
       "
    >
      {currentUser.isAdmin && userPosts.length ? (
        <>
          <Table className="shadow-lg" hoverable>
            <TableHead>
              <TableHeadCell>Date Update</TableHeadCell>
              <TableHeadCell>Post image</TableHeadCell>
              <TableHeadCell>Post title</TableHeadCell>
              <TableHeadCell>Category</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
              <TableHeadCell>
                <span>Edit</span>
              </TableHeadCell>
            </TableHead>
            {userPosts.map((post) => (
              <TableBody key={uuidv4()} className="divide-y">
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell>
                    {new Date(post.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-20 h-10 object-cover bg-gray-500"
                      />
                    </Link>
                  </TableCell>
                  <TableCell>
                    <Link
                      className="font-medium text-gray-900 dark:text-white capitalize"
                      to={`/post/${post.slug}`}
                    >
                      {post.title}
                    </Link>
                  </TableCell>
                  <TableCell className="text-center">
                    <TableCell>{post.category}</TableCell>
                  </TableCell>
                  <TableCell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setPostIdToDelete(post._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/update-post/${post._id}`}
                      className="text-teal-500"
                    >
                      <span>Edit</span>
                    </Link>
                  </TableCell>
                </TableRow>
              </TableBody>
            ))}
          </Table>
          {showMore && (
            <Button
              onClick={showMoreHandler}
              className="w-full text-teal-500 self-center text-sm py-7 bg-transparent dark:bg-transparent dark:text-white"
            >
              Show More
            </Button>
          )}
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <p>You have no posts yet!</p>
          <DotLoader color="#24d321" />
        </div>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <ModalHeader />
        <ModalBody>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color={"failure"} onClick={deletePostHandler}>
                Yes, I&apos;m sure
              </Button>
              <Button color={"gray"} onClick={() => setShowModal(false)}>
                No, Cancel
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default DashPost;
