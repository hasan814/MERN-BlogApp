import { HiOutlineExclamationCircle } from "react-icons/hi";
import { useEffect, useState } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
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

const DashComment = () => {
  // ==================== State ==============
  const [comments, setComments] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [commentIdToDelete, setCommentIdToDelete] = useState("");

  // ==================== Redux ==============
  const { currentUser } = useSelector((state) => state.user);

  // ==================== Effect ==============
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await fetch("/api/comment/getcomments");
        const responseData = await response.json();
        console.log(response);
        if (response.ok) {
          setComments(responseData.comments);
          if (responseData.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) fetchComments();
  }, [currentUser._id, currentUser.isAdmin]);

  // ==================== Function ==============
  const showMoreHandler = async () => {
    const startIndex = comments.length;
    try {
      const response = await fetch(
        `/api/user/getcomments?startIndex=${startIndex}`
      );
      const responseData = await response.json();
      if (response.ok) {
        setComments((prev) => [...prev, ...responseData.comments]);
        if (responseData.comments.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteCommentHandler = async () => {
    setShowModal(false);
    try {
      const response = await fetch(
        `/api/comment/deleteComment/${commentIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      const responseData = await response.json();
      if (response.ok) {
        setComments((prev) =>
          prev.filter((comment) => comment._id !== commentIdToDelete)
        );
        setShowModal(false);
        toast.success("Comment Deleted Successfully");
      } else {
        console.log(responseData.message);
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
      {currentUser.isAdmin && comments.length ? (
        <>
          <Table className="shadow-lg" hoverable>
            <TableHead>
              <TableHeadCell>Date Updated</TableHeadCell>
              <TableHeadCell>Comment Content</TableHeadCell>
              <TableHeadCell>Number of Likes</TableHeadCell>
              <TableHeadCell>PostId</TableHeadCell>
              <TableHeadCell>UserId</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
            </TableHead>
            {comments.map((comment) => (
              <TableBody key={uuidv4()} className="divide-y">
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell>
                    {new Date(comment.updatedAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{comment.content}</TableCell>
                  <TableCell>{comment.numberOfLikes}</TableCell>
                  <TableCell>{comment.postId}</TableCell>
                  <TableCell>{comment.userId}</TableCell>
                  <TableCell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setCommentIdToDelete(comment._id);
                      }}
                      className="font-medium text-red-500 hover:underline cursor-pointer"
                    >
                      Delete
                    </span>
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
          <p>You have no comments yet!</p>
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
              Are you sure you want to delete this Users?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color={"failure"} onClick={deleteCommentHandler}>
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

export default DashComment;
