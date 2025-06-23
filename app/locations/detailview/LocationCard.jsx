"use client";
import { useRouter } from "next/navigation";
import { MapPin } from "lucide-react";
import { CountPills } from "../../components";

const LocationCard = ({ location }) => {
  const router = useRouter();
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => router.push(`?type=location&id=${location.id}`)}
      onKeyDown={(e) =>
        e.key === "Enter"
          ? router.push(`?type=location&id=${location.id}`)
          : null
      }
      className="@container rounded-md px-4 py-5 @sm:py-4 relative text-white bg-primary-800 hover:bg-primary-900 active:bg-primary-950"
    >
      <div className="flex flex-col justify-between @260px:flex-row items-start @260px:items-stretch h-full gap-4">
        <h2 className="pl-1 pr-2 font-semibold leading-tight hyphens-auto text-pretty !break-words flex items-center">
          <MapPin size={18} className="inline mt-[-2px] mr-1.5" />
          {location?.name}
        </h2>

        <CountPills
          containerCount={location?._count?.containers}
          itemCount={location?._count?.items}
          textClasses={"text-sm !font-semibold"}
          verticalMargin="my-0 !pl-0"
          showContainers
          showItems
          showEmpty
          transparent
        />
      </div>
    </div>
  );
};

export default LocationCard;
