import { IconHeart, IconHeartFilled } from "@tabler/icons-react";

const ColoredFavorite = ({ item, onClick }) => {
  return (
    <div
      className={`transition-all relative ml-[3px] mt-[2px] pt-[1px] flex w-5 h-5 items-center justify-center rounded-xl  ${
        item?.favorite ? "bg-white" : ""
      }`}
      onClick={() => onClick(item)}
    >
      {item?.favorite ? (
        <IconHeartFilled
          size={15}
          strokeWidth={2}
          className="text-danger-400"
        />
      ) : (
        <IconHeart size={15} />
      )}
    </div>
  );
};

export default ColoredFavorite;
