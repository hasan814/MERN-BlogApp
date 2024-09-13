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

const DashUsers = () => {
  // ==================== State ==============
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdToDelete, setUserIdToDelete] = useState("");

  // ==================== Redux ==============
  const { currentUser } = useSelector((state) => state.user);

  // ==================== Effect ==============
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`/api/user/getusers`);
        const responseData = await response.json();
        if (response.ok) {
          setUsers(responseData.users);
          if (responseData.users.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) fetchUsers();
  }, [currentUser._id, currentUser.isAdmin]);

  // ==================== Function ==============
  const showMoreHandler = async () => {
    const startIndex = users.length;
    try {
      const response = await fetch(
        `/api/user/getusers?startIndex=${startIndex}`
      );
      const responseData = await response.json();
      if (response.ok) {
        setUsers((prev) => [...prev, ...responseData.posts]);
        if (responseData.users.length < 9) setShowMore(false);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const deleteUserHandler = async () => {
    setShowModal(false);
    try {
      const response = await fetch(`/api/user/delete/${userIdToDelete}`, {
        method: "DELETE",
      });
      const responseData = await response.json();
      if (response.ok) {
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModal(false);
        toast.success("User Deleted Successfully");
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
      {currentUser.isAdmin && users.length ? (
        <>
          <Table className="shadow-lg" hoverable>
            <TableHead>
              <TableHeadCell>Date Created</TableHeadCell>
              <TableHeadCell>User image</TableHeadCell>
              <TableHeadCell>Username</TableHeadCell>
              <TableHeadCell>Email</TableHeadCell>
              <TableHeadCell>Admin</TableHeadCell>
              <TableHeadCell>Delete</TableHeadCell>
            </TableHead>
            {users.map((user) => (
              <TableBody key={uuidv4()} className="divide-y">
                <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <TableCell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <img
                      src={
                        user.profilePicture
                          ? user.profilePicture
                          : "https://img.icons8.com/color/48/gender-neutral-user.png"
                      }
                      alt={user.username}
                      className="w-10 h-10 object-cover bg-gray-500 rounded-full"
                    />
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.isAdmin ? (
                      <FaCheck />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    <span
                      onClick={() => {
                        setShowModal(true);
                        setUserIdToDelete(user._id);
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
          <p>You have no users yet!</p>
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
              <Button color={"failure"} onClick={deleteUserHandler}>
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

export default DashUsers;
