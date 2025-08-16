import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  CardMenu,
  CardToggle,
  ListPill,
  SearchFilter,
  ThumbnailCard,
  ThumbnailGrid,
} from "@/app/components";
import LocationCard from "./LocationCard";
import { DeviceContext } from "@/app/providers";
import { MapPin } from "lucide-react";

const LocationListView = ({ locations, view }) => {
  const [filter, setFilter] = useState("");
  const router = useRouter();
  const { isMobile } = useContext(DeviceContext);

  const handleClick = (location) => {
    router.push(`/locations?type=location&id=${location.id}`);
  };

  const locationsToShow = locations?.filter((l) =>
    l.name?.toLowerCase()?.includes(filter?.toLowerCase())
  );

  return (
    <>
      <SearchFilter
        filter={filter}
        onChange={(e) => setFilter(e.target.value)}
        label="Filter by name"
        size="md"
        padding=""
        classNames="max-md:w-full grow"
      />
      <div className="flex flex-wrap-reverse gap-2 items-center my-4">
        <CardToggle />
      </div>

      {!view ? (
        <ThumbnailGrid>
          {locationsToShow?.map((location) => (
            <ThumbnailCard
              key={location.name}
              item={location}
              type="location"
              handleClick={handleClick}
            />
          ))}
        </ThumbnailGrid>
      ) : null}
      {view === 1 ? (
        <div className="@container">
          <div className="grid grid-flow-row gap-3  @sm:grid-cols-2 @lg:grid-cols-3 @3xl:grid-cols-4 @4xl:grid-cols-5 @5xl:grid-cols-5 @6xl:grid-cols-6">
            {locationsToShow?.map((location) => (
              <LocationCard
                key={`location${location.name}`}
                location={location}
                handleClick={handleClick}
              />
            ))}
          </div>
        </div>
      ) : null}

      {view === 2 ? (
        <div>
          {locationsToShow?.map((location) => (
            <div
              role="button"
              tabIndex={0}
              onClick={() => handleClick(location)}
              key={location.name}
              className="w-full flex justify-between items-center h-[50px] rounded pl-3 pr-1 border-b hover:bg-bluegray-100"
            >
              <div className="flex gap-1.5 items-center">
                <MapPin size={17} />
                <h2
                  className={`font-medium text-nowrap ${
                    isMobile ? "text-sm" : "text-base"
                  }`}
                >
                  {location?.name}
                </h2>
              </div>
              <div className="flex gap-2 items-center justify-end">
                <ListPill
                  count={location?._count?.containers}
                  type="container"
                />
                <ListPill count={location?._count?.items} type="item" />
                <CardMenu item={location} type="location" iconSize={22} />
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
};

export default LocationListView;
