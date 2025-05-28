"use client";
import { useContext, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import useSWR from "swr";
import {
  BreadcrumbTrail,
  Loading,
  Favorite,
  GridLayout,
  UpdateColor,
} from "@/app/components";
import { LocationContext } from "./layout";
import { DeviceContext } from "../layout";
import { fetcher } from "../lib/fetcher";
import ItemPage from "./ItemPage";
import { handleFavoriteClick } from "./handlers";
import LocationListView from "./detailview/LocationListView";
import ItemContainerListView from "./detailview/ItemContainerListView";

const Page = () => {
  const searchParams = useSearchParams();
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  const { locationList, setPageData, setSelectedKey } =
    useContext(LocationContext);

  const selectedKey = `/locations/api/selected?type=${type}&id=${id}`;

  const { data, error, isLoading } = useSWR(selectedKey, type ? fetcher : null);

  const { setCrumbs } = useContext(DeviceContext);

  useEffect(() => {
    setCrumbs(<BreadcrumbTrail data={data} isLocation />);
    setPageData(data);
    setSelectedKey(selectedKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, id, type]);

  if (error) return "Failed to fetch";
  if (isLoading) return <Loading />;

  return (
    <>
      <div className="flex gap-2 items-center pb-6">
        <h1 className="font-bold text-4xl">
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
              />
            ) : null}
            <Favorite
              size={26}
              emptyColor="black"
              position=""
              onClick={() => handleFavoriteClick(data, selectedKey)}
              item={data}
            />
          </>
        ) : null}
      </div>

      {type === "item" ? (
        <ItemPage item={data} />
      ) : (
        <GridLayout>
          {type && id ? (
            <ItemContainerListView data={data} fetchKey={selectedKey} />
          ) : (
            <LocationListView locations={locationList} />
          )}
        </GridLayout>
      )}
    </>
  );
};

export default Page;
