import { useSelector } from "react-redux";

const ThemeProvider = ({ children }) => {
  // ============== Redux ============
  const { theme } = useSelector((state) => state.theme); // Ensure 'theme' is defined properly in Redux

  // ============== Rendering ============
  return (
    <div className={theme}>
      <div className="bg-white text-gray-700 dark:text-gray-200 min-h-screen dark:bg-[rgb(2,14,48)]">
        {children}
      </div>
    </div>
  );
};

export default ThemeProvider;
