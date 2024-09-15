import { Button, Select, TextInput } from "flowbite-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { HashLoader } from "react-spinners";
import { motion } from "framer-motion"; // Import framer-motion

import PostCard from "../components/modules/PostCard";

const Search = () => {
  // ============== Navigate ===============
  const navigate = useNavigate();

  // ============== Location ===============
  const location = useLocation();

  // ============== State ===============
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    sort: "desc",
    category: "uncategorized",
  });

  // ============== Effect ===============
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFormUrl = urlParams.get("searchTerm");
    const sortFormUrl = urlParams.get("sort");
    const categoryFormUrl = urlParams.get("category");
    if (searchTermFormUrl || sortFormUrl || categoryFormUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFormUrl,
        sort: sortFormUrl,
        category: categoryFormUrl,
      });
    }
    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const response = await fetch(`/api/post/getPosts?${searchQuery}`);
      const responseData = await response.json();
      if (!response.ok) {
        setLoading(false);
        return;
      }
      if (response.ok) {
        setPosts(responseData.posts);
        setLoading(false);
        if (responseData.posts.length === 0) setShowMore(true);
        else setShowMore(false);
      }
    };
    fetchPosts();
  }, [location.search]);

  // ============== Function ===============
  const changeHandler = (event) => {
    if (event.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: event.target.value });
    }
    if (event.target.id === "sort") {
      const order = event.target.value || "desc";
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (event.target.id === "category") {
      const category = event.target.value || "uncategorized";
      setSidebarData({ ...sidebarData, category });
    }
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const showMoreHandler = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const response = await fetch(`/api/post/getPosts?${searchQuery}`);
    const responseData = await response.json();
    if (!response.ok) return;
    if (response.ok) {
      setPosts([...posts, ...responseData.posts]);
      if (responseData.posts.length === 9) setShowMore(true);
      else setShowMore(false);
    }
  };

  // Framer Motion animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    visible: {
      transition: { staggerChildren: 0.1 },
    },
  };

  // ============== Rendering ===============
  return (
    <div className="flex flex-col md:flex-row">
      <motion.div
        className="p-7 border-b md:border-r md:min-h-screen border-gray-500"
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
      >
        <form className="flex flex-col gap-8" onSubmit={submitHandler}>
          <motion.div className="flex items-center gap-2" variants={fadeInUp}>
            <label className="font-semibold whitespace-nowrap">
              Search Term:
            </label>
            <TextInput
              type="text"
              id="searchTerm"
              className="w-full"
              placeholder="Search..."
              onChange={changeHandler}
              value={sidebarData.searchTerm}
            />
          </motion.div>
          <motion.div className="flex items-center gap-2" variants={fadeInUp}>
            <label className="font-semibold">Sort:</label>
            <Select
              id="sort"
              className="w-full"
              onChange={changeHandler}
              value={sidebarData.sort}
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </Select>
          </motion.div>
          <motion.div className="flex items-center gap-2" variants={fadeInUp}>
            <label className="font-semibold">Category:</label>
            <Select
              id="category"
              className="w-full"
              onChange={changeHandler}
              value={sidebarData.category}
            >
              <option value="uncategorized">uncategorized</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
              <option value="javascript">javaScript</option>
            </Select>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Button type="submit" outline gradientDuoTone={"purpleToPink"}>
              Apply Filters
            </Button>
          </motion.div>
        </form>
      </motion.div>
      <div className="w-full">
        <motion.h1
          className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 text-center"
          variants={fadeInUp}
          initial="hidden"
          animate="visible"
        >
          Post Results
        </motion.h1>
        <motion.div
          className="p-7 flex flex-wrap gap-4"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No Posts found.</p>
          )}
          {loading && <HashLoader color="#25bc58" />}
          {!loading &&
            posts &&
            posts.map((post) => (
              <motion.div key={uuidv4()} variants={fadeInUp}>
                <PostCard post={post} />
              </motion.div>
            ))}
          {showMore && (
            <motion.button
              onClick={showMoreHandler}
              className="text-teal-500 text-lg hover:underline p-7 w-full"
              variants={fadeInUp}
            >
              Show more
            </motion.button>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Search;
