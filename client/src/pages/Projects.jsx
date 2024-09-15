import { motion } from "framer-motion";

import CallToAction from "../components/modules/CallToAction";

const Projects = () => {
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const staggerContainer = {
    visible: {
      transition: { staggerChildren: 0.2 },
    },
  };

  return (
    <motion.div
      className="min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3"
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      <motion.h1 className="text-3xl font-semibold" variants={fadeInUp}>
        Projects
      </motion.h1>
      <motion.p className="text-md text-gray-500" variants={fadeInUp}>
        Build fun and engaging projects while learning HTML, CSS, and JavaScript
      </motion.p>
      <motion.div variants={fadeInUp}>
        <CallToAction />
      </motion.div>
    </motion.div>
  );
};

export default Projects;
