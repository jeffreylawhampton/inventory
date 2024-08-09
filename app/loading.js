import { CircularProgress } from "@nextui-org/react";
const Loading = () => {
  return (
    <div className="fullheight flex items-center justify-center">
      <CircularProgress aria-label="Loading" />
    </div>
  );
};

export default Loading;
