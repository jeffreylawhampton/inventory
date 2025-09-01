import { useContext } from "react";
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
import { DeviceContext, FilterContext } from "@/app/providers";
import { MapPin } from "lucide-react";

const LocationListView = ({ locations }) => {
  const router = useRouter();
  const { isMobile } = useContext(DeviceContext);
  const { filter, setFilter, view } = useContext(FilterContext);

  const handleClick = (location) => {
    router.push(`/locations?type=location&id=${location.id}`);
  };

  const locationsToShow = locations?.filter((l) =>
    l.name?.toLowerCase()?.includes(filter?.toLowerCase())
  );

  const handleKeyDown = (event, location) => {
    if (event.key === "Enter") {
      handleClick(location);
    }
  };

  return (
    <div className="h-full pb-32">
      <div className="px-1.5 lg:px-3">
        <SearchFilter
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
            <div className="grid grid-flow-row gap-3 @sm:grid-cols-2 @lg:grid-cols-3 @3xl:grid-cols-4 @4xl:grid-cols-5 @5xl:grid-cols-5 @6xl:grid-cols-6">
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
      </div>
      {view === 2 ? (
        <div className="lg:pl-1">
          {locationsToShow?.map((location) => (
            <div
              key={location.name}
              className="relative w-full flex justify-between items-center h-[50px] rounded p-3 pr-1 border-b hover:bg-bluegray-100"
            >
              <div
                className="absolute w-full h-full top-0 left-0"
                onClick={() => handleClick(location)}
                onKeyDown={(e) => handleKeyDown(e, location)}
                role="button"
                tabIndex={0}
              />
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
              <div className="flex gap-2 items-center justify-end relative">
                <ListPill
                  count={location?._count?.containers}
                  type="container"
                />
                <ListPill count={location?._count?.items} type="item" />
                <CardMenu item={location} type="location" iconSize={26} />
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default LocationListView;
