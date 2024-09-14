import { Link } from "react-router-dom";

import PropTypes from "prop-types";

const PostCard = ({ post }) => {
  return (
    <div
      className="
            group 
            w-full 
            border
            relative 
            h-[400px] 
            rounded-lg
            sm:w-[330px]
            hover:border-2
            transition-all 
            overflow-hidden
            border-teal-500
            "
    >
      <Link to={`/post/${post.slug}`}>
        <img
          src={post.image}
          alt="post cover"
          className="
            w-full 
            h-[260px] 
            object-cover 
            transition-all 
            duration-300 z-20
            group-hover:h-[200px] 
            "
        />
      </Link>
      <div className="p-3 flex flex-col gap-2">
        <p className="text-lg font-semibold line-clamp-2">{post.title}</p>
        <span className="italic text-sm">{post.category}</span>
        <Link
          to={`/post/${post.slug}`}
          className="
            m-2
            z-10 
            py-2
            left-0 
            border 
            right-0 
            absolute 
            rounded-md
            text-center 
            duration-300
            transition-all
            bottom-[-200px] 
            text-teal-500
            !rounded-tl-none 
            !rounded-tr-none 
            border-teal-500 
            hover:text-white 
            hover:bg-teal-500
            group-hover:bottom-0 
            "
        >
          Read Article
        </Link>
      </div>
    </div>
  );
};

PostCard.propTypes = {
  post: PropTypes.shape({
    slug: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    category: PropTypes.string.isRequired,
  }).isRequired,
};

export default PostCard;
