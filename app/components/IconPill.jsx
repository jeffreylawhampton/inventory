import { useRouter } from "next/navigation";

const IconPill = ({
  href,
  icon,
  name,
  labelClasses,
  bgClasses = "bg-bluegray-200/80 hover:bg-bluegray-300/80 active:bg-bluegray-300",
}) => {
  const router = useRouter();
  return (
    <div
      onClick={href ? () => router.push(href) : null}
      className={`cursor-pointer rounded-full flex items-center gap-[3px] py-1 px-3 font-semibold text-xs text-black ${bgClasses}`}
    >
      {icon}
      <span className={labelClasses}>{name}</span>
    </div>
  );
};

export default IconPill;
