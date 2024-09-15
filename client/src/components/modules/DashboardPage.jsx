import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";

import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from "flowbite-react";
import { Link } from "react-router-dom";

const DashboardPage = () => {
  // =============== Redux ================
  const { currentUser } = useSelector((state) => state.user);

  // =============== State ================
  const [users, setUsers] = useState([]);
  const [comments, setComments] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const [lastMonthComments, setLastMonthComments] = useState(0);

  // =============== Effect ================
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/user/getusers?limit=5");
        const responseData = await response.json();
        if (response.ok) {
          setUsers(responseData.users);
          setTotalUsers(responseData.totalUsers);
          setLastMonthUsers(responseData.lastMonthUsers);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/post/getposts?limit=5");
        const responseData = await response.json();
        if (response.ok) {
          setPosts(responseData.posts);
          setTotalPosts(responseData.totalPosts);
          setLastMonthPosts(responseData.lastMonthPosts);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchComments = async () => {
      try {
        const response = await fetch("/api/comment/getcomments?limit=5");
        const responseData = await response.json();
        if (response.ok) {
          setComments(responseData.comments);
          setTotalComments(responseData.totalComments);
          setLastMonthComments(responseData.lastMonthComments);
        }
      } catch (error) {
        console.log(error);
      }
    };
    if (currentUser.isAdmin) {
      fetchUsers();
      fetchPosts();
      fetchComments();
    }
  }, [currentUser]);

  // =============== Function ================
  // =============== Rendering ================
  return (
    <div className="p-3 md:mx-auto">
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h1 className="text-gray-500 text-md uppercase">Total Users</h1>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h1 className="text-gray-500 text-md uppercase">
                Total Comments
              </h1>
              <p className="text-2xl">{totalComments}</p>
            </div>
            <HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthComments}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>
        <div className="flex flex-col p-3 dark:bg-slate-800 gap-4 md:w-72 w-full rounded-md shadow-md">
          <div className="flex justify-between">
            <div className="">
              <h1 className="text-gray-500 text-md uppercase">Total Posts</h1>
              <p className="text-2xl">{totalPosts}</p>
            </div>
            <HiDocumentText className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="text-green-500 flex items-center">
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>
            <div className="text-gray-500">Last Month</div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Users</h1>
            <Button outline gradientDuoTone={"purpleToPink"}>
              <Link to={"/dashboard?tab=users"}>See All</Link>
            </Button>
          </div>
          <Table hoverable>
            <TableHead>
              <TableHeadCell>User Image</TableHeadCell>
              <TableHeadCell>Username</TableHeadCell>
            </TableHead>
            {users &&
              users.map((user) => (
                <TableBody key={uuidv4()} className="divide-y">
                  <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <TableCell>
                      <img
                        src={user.profilePicture}
                        alt="uder"
                        className="w-10 h-10 rounded-full bg-gray-500"
                      />
                    </TableCell>
                    <TableCell>{user.username}</TableCell>
                  </TableRow>
                </TableBody>
              ))}
          </Table>
        </div>
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Comments</h1>
            <Button outline gradientDuoTone={"purpleToPink"}>
              <Link to={"/dashboard?tab=comments"}>See All</Link>
            </Button>
          </div>
          <Table hoverable>
            <TableHead>
              <TableHeadCell>Comment Content</TableHeadCell>
              <TableHeadCell>Likes</TableHeadCell>
            </TableHead>
            {comments &&
              comments.map((comment) => (
                <TableBody key={uuidv4()} className="divide-y">
                  <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <TableCell className="w-96">
                      <p className="line-clamp-2">{comment.content}</p>
                    </TableCell>
                    <TableCell>{comment.numberOfLikes}</TableCell>
                  </TableRow>
                </TableBody>
              ))}
          </Table>
        </div>
        <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md dark:bg-gray-800">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="text-center p-2">Recent Posts</h1>
            <Button outline gradientDuoTone={"purpleToPink"}>
              <Link to={"/dashboard?tab=posts"}>See All</Link>
            </Button>
          </div>
          <Table hoverable>
            <TableHead>
              <TableHeadCell>User Image</TableHeadCell>
              <TableHeadCell>Post Title</TableHeadCell>
              <TableHeadCell>Category</TableHeadCell>
            </TableHead>
            {posts &&
              posts.map((post) => (
                <TableBody key={uuidv4()} className="divide-y">
                  <TableRow className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <TableCell>
                      <img
                        src={post.image}
                        alt="uder"
                        className="w-10 h-10 rounded-md bg-gray-500"
                      />
                    </TableCell>
                    <TableCell className="w-96">{post.title}</TableCell>
                    <TableCell className="w-5">{post.category}</TableCell>
                  </TableRow>
                </TableBody>
              ))}
          </Table>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
