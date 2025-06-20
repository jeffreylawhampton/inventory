"use client";
import { useContext, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import {
  BreadcrumbTrail,
  Favorite,
  Loading,
  UpdateColor,
} from "@/app/components";
import { LocationContext } from "./layout";
import { DeviceContext } from "../layout";
import { fetcher } from "../lib/fetcher";
import { handleFavoriteClick } from "./handlers";
import ItemPage from "./detailview/ItemPage";
import LocationListView from "./detailview/LocationListView";
import ItemContainerListView from "./detailview/ItemContainerListView";
import LucideIcon from "../components/LucideIcon";

const Page = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  const { locationList, setPageData, setSelectedKey } =
    useContext(LocationContext);

  const selectedKey = `/locations/api/selected?type=${type}&id=${id}`;

  const { isMobile, hideCarouselNav, setShowIconPicker } =
    useContext(DeviceContext);
  const { data, error, isLoading } = useSWR(selectedKey, type ? fetcher : null);

  useEffect(() => {
    setPageData(data);
    setSelectedKey(selectedKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, id, type]);

  if (error) return "Failed to fetch";
  if (isLoading) return <Loading />;

  const handleIconPickerClick = () => {
    setShowIconPicker(true);
  };

  return (
    <div className="pt-6 lg:px-2">
      <BreadcrumbTrail data={data} isLocation />
      <div className="flex gap-2 items-center py-2 mt-2">
        <h1 className="font-bold text-2xl lg:text-4xl">
          {type && id ? data?.name : "All locations"}
        </h1>

        {type === "container" || type === "item" ? (
          <>
            {type === "container" ? (
              <UpdateColor
                data={data}
                mutateKey={selectedKey}
                additionalMutate="/locations/api"
                type={type}
                size={isMobile ? 23 : 26}
                setShowIconPicker={setShowIconPicker}
              />
            ) : (
              <LucideIcon
                iconName={data?.icon}
                type={type}
                size={24}
                onClick={handleIconPickerClick}
              />
            )}
            <Favorite
              size={23}
              emptyColor="black"
              onClick={() => handleFavoriteClick(data, selectedKey)}
              item={data}
            />
          </>
        ) : null}
      </div>

      {type === "item" ? (
        <ItemPage
          item={data}
          mutateKey={selectedKey}
          hideCarouselNav={hideCarouselNav}
        />
      ) : (
        <>
          {type && id ? (
            <ItemContainerListView
              data={data}
              fetchKey={selectedKey}
              type={type}
              id={id}
            />
          ) : (
            <LocationListView locations={locationList} />
          )}
        </>
      )}
    </div>
  );
};

export default Page;
