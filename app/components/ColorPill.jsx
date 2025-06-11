import { useRouter } from "next/navigation";
import { IconBox } from "@tabler/icons-react";

const ColorPill = ({
  container,
  bgClasses = "bg-bluegray-200/80 hover:bg-bluegray-300/80 active:bg-bluegray-300",
  isLocation,
}) => {
  const router = useRouter();

  return (
    <button
      onClick={() =>
        router.push(
          isLocation
            ? `/locations?type=container&id=${container.id}`
            : `/containers/${container.id}`
        )
      }
      className={`bg-bluegray-200/80 cursor-pointer rounded-full flex items-center gap-[3px] py-1 px-2 font-semibold text-[10px] text-black ${bgClasses} hover:brightness-90 active:brightness-[80%]`}
    >
      <IconBox
        fill={container?.color?.hex || "white"}
        aria-label="Container"
        size={14}
      />

      <span>{container?.name}</span>
    </button>
  );
};

export default ColorPill;
