import { useContext } from "react";
import { Box, Layers } from "lucide-react";
import { DeviceContext } from "../providers";

const ListPill = ({ count, type }) => {
  const { isMobile, showDelete } = useContext(DeviceContext);
  const iconProps = {
    size: isMobile ? 11 : 13,
    strokeWidth: 2.5,
  };

  return (
    <div
      className={`rounded-full py-[2px] min-w-11 flex gap-1 items-center justify-center text-xs lg:text-sm font-semibold ${
        showDelete ? "bg-white/30" : "bg-bluegray-100"
      }`}
    >
      {type === "item" ? <Layers {...iconProps} /> : <Box {...iconProps} />}
      {count}
    </div>
  );
};

export default ListPill;
