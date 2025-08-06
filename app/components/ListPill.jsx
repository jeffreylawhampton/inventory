import { Box, Layers } from "lucide-react";

const ListPill = ({ count, type, showDelete }) => {
  return (
    <div
      className={`rounded-full py-[2px] min-w-11 flex gap-[3px] items-center justify-center text-sm font-semibold ${
        showDelete ? "bg-white/30" : "bg-bluegray-100"
      }`}
    >
      {type === "item" ? <Layers size={13} /> : <Box size={13} />}
      {count}
    </div>
  );
};

export default ListPill;
