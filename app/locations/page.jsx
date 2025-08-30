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
import { DeviceContext, FilterContext } from "../providers";
import { fetcher } from "../lib/helpers";
import { handleFavoriteClick } from "./handlers";
import ItemPage from "./detailview/ItemPage";
import LocationListView from "./detailview/LocationListView";
import ItemContainerListView from "./detailview/ItemContainerListView";

const Page = () => {
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
    handleUpdateColor();
  };

  const updateIconClick = () => {
    handleUpdateIcon();
  };

  return (
    <div className="pt-4">
      <div className="px-1.5 lg:px-3">
        <BreadcrumbTrail data={data} isLocation />
      </div>
      <div className="flex gap-3 items-center py-2 mt-2 px-1.5 lg:px-3">
        <h1 className="font-bold text-2xl lg:text-4xl">
          {type && id ? data?.name : "All locations"}
        </h1>

        {type === "container" || type === "item" ? (
          <>
            <PickerMenu
              data={data}
              type={type}
              handleIconPickerClick={updateIconClick}
              updateColorClick={updateColorClick}
              iconSize={24}
              isCard={false}
            />
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
