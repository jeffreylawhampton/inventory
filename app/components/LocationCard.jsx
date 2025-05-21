"use client";
import Link from "next/link";
import {
  IconCircleMinus,
  IconCircle,
  IconExternalLink,
} from "@tabler/icons-react";
import CountPills from "./CountPills";
import { useRouter } from "next/navigation";

const LocationCard = ({
  location,
  handleSelect,
  isSelected,
  isActive,
  showDelete,
}) => {
  const router = useRouter();
  return (
    <div
      className={`group rounded-md overflow-hidden relative shadow-sm ${
        isActive ? "bg-bluegray-300/90" : "bg-bluegray-200/40"
      } hover:brightness-90 border border-bluegray-200/80 hover:border-bluegray-300/90 active:shadow-none active:bg-bluegray-400/80 ${
        showDelete
          ? !isSelected
            ? "opacity-50"
            : " !border-danger-500 box-content"
          : ""
      }`}
      onClick={() => handleSelect(location.id)}
    >
      <div className="py-2 pl-[16px] pr-3">
        <span className="flex gap-2 mb-[1px] justify-between items-center">
          <Link
            href={showDelete ? null : `locations/${location.id}`}
            prefetch={false}
          >
            <h2 className="flex gap-1 items-center text-sm font-semibold leading-tight break-words hyphens-auto text-pretty">
              {location?.name} <IconExternalLink size={12} />
            </h2>
          </Link>
          <div className="flex items-center gap-3">
            <CountPills
              containerCount={location?.containers?.length}
              itemCount={location?.items?.length}
              textClasses={"text-xs font-medium"}
              verticalMargin="my-0 !pl-0"
              showContainers
              showItems
              transparent
              showDelete={showDelete}
            />
            {showDelete ? (
              <>
                {isSelected ? (
                  <IconCircleMinus
                    className="text-white bg-danger rounded-full w-5 h-5"
                    aria-label="Unselected"
                  />
                ) : (
                  <IconCircle
                    className="text-bluegray-500 opacity-50 w-5 h-5"
                    aria-label="Selected"
                  />
                )}
              </>
            ) : null}
          </div>
        </span>
      </div>
    </div>
  );
};

export default LocationCard;
