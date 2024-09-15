import { Button } from "flowbite-react";

const CallToAction = () => {
  return (
    <div className="flex flex-col sm:flex-row p-3 border border-teal-500 justify-center items-center rounded-tl-3xl rounded-br-3xl">
      <div className="flex-1 flex flex-col justify-center">
        <h2 className="text-2xl">Want to learn more about JavaScript?</h2>
        <p className="text-gray-500 my-2">
          Checkout these resources with 100 JavaScript Projects.
        </p>
        <Button
          className="rounded-tl-xl rounded-bl-none"
          gradientDuoTone={"purpleToPink"}
        >
          Learn More
        </Button>
      </div>
      <div className="p-7 flex-1 ml-auto">
        <a
          href="https://www.100newjsprojects.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="https://www.squash.io/wp-content/uploads/2023/11/javascript-series.jpg"
            alt="JavaScript Projects"
            className="w-[500px] h-[300px]"
          />
        </a>
      </div>
    </div>
  );
};

export default CallToAction;
