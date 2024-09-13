import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { DotLoader } from "react-spinners";

const DashPost = () => {
  // ==================== State ==============
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);

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
          if (responseData.length < 9) {
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
                    <span className="font-medium text-red-500 hover:underline cursor-pointer">
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
    </div>
  );
};

export default DashPost;
