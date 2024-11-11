import { IconMapPin } from "@tabler/icons-react";
import Link from "next/link";

const LocationPill = ({ locationName, locationId }) => {
  return (
    <Link
      href={`/locations/${locationId}`}
      className={`flex gap-[4px] h-[27px] text-xs justify-center items-center rounded-full cursor-pointer pl-3 pr-2 bg-white/20 hover:bg-white/40 "
        `}
    >
      <div className="font-semibold flex gap-[2px] items-center justify-center">
        <IconMapPin size={18} strokeWidth={2} className="mt-[-2px]" />
        {locationName}
      </div>
    </Link>
  );
};

export default LocationPill;
