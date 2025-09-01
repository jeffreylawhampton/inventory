import { useRouter } from "next/navigation";
import { Box } from "lucide-react";

const ColorPill = ({
  container,
  navigate = true,
  bgClasses = `${
    navigate
      ? "bg-bluegray-200/80 hover:bg-bluegray-300/80 active:bg-bluegray-300"
      : ""
  }`,
  isLocation,
}) => {
  const router = useRouter();

  return (
    <button
      onClick={
        navigate
          ? () =>
              router.push(
                isLocation
                  ? `/locations?type=container&id=${container.id}`
                  : `/containers/${container.id}`
              )
          : null
      }
      className={`bg-bluegray-200/80 cursor-pointer rounded-full flex items-center gap-[3px] py-1 px-2 font-semibold text-[10px] text-black ${bgClasses} ${
        navigate ? "hover:brightness-90 active:brightness-[80%]" : ""
      }`}
    >
      <Box
        fill={container?.color?.hex || "transparent"}
        aria-label="Container"
        size={14}
      />

      <span className="!w-fit text-nowrap">{container?.name}</span>
    </button>
  );
};

export default ColorPill;
