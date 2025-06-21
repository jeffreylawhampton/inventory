"use client";
import { useContext, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import {
  BreadcrumbTrail,
  Favorite,
  Loading,
  PickerMenu,
} from "@/app/components";
import { LocationContext } from "./layout";
import { DeviceContext } from "../layout";
import { fetcher } from "../lib/fetcher";
import { handleFavoriteClick } from "./handlers";
import ItemPage from "./detailview/ItemPage";
import LocationListView from "./detailview/LocationListView";
import ItemContainerListView from "./detailview/ItemContainerListView";

const Page = () => {
  const [opened, setOpened] = useState(false);
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  const {
    locationList,
    setPageData,
    setSelectedKey,
    handleUpdateColor,
    handleUpdateIcon,
  } = useContext(LocationContext);

  const selectedKey = `/locations/api/selected?type=${type}&id=${id}`;

  const { hideCarouselNav } = useContext(DeviceContext);
  const { data, error, isLoading } = useSWR(selectedKey, type ? fetcher : null);

  useEffect(() => {
    setPageData(data);
    setSelectedKey(selectedKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, id, type]);

  if (error) return "Failed to fetch";
  if (isLoading) return <Loading />;

  const updateColorClick = () => {
    setOpened(() => false);
    handleUpdateColor();
  };

  const updateIconClick = () => {
    setOpened(() => false);
    handleUpdateIcon();
  };

  return (
    <div className="pt-6 lg:px-2">
      <BreadcrumbTrail data={data} isLocation />
      <div className="flex gap-2 items-center py-2 mt-2">
        <h1 className="font-bold text-2xl lg:text-4xl">
          {type && id ? data?.name : "All locations"}
        </h1>

        <PickerMenu
          opened={opened}
          setOpened={setOpened}
          data={data}
          type={type}
          handleIconPickerClick={updateIconClick}
          updateColorClick={updateColorClick}
        />
        {type === "container" || type === "item" ? (
          <>
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
