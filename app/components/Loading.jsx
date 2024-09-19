import { Loader } from "@mantine/core";
const Loading = ({ size = "md" }) => {
  return (
    <div className="w-screen h-screen fixed top-0 left-0 flex items-center justify-center">
      <Loader size={size} aria-label="Loading" />
    </div>
  );
};

export default Loading;
