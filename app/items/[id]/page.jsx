"use client";
import { useState, useContext, useEffect } from "react";
import { useUser } from "@/app/hooks/useUser";
import {
  BreadcrumbTrail,
  CategoryPill,
  ContextMenu,
  Favorite,
  ImageCarousel,
  ImageLightbox,
  Loading,
} from "@/app/components";
import { DeviceContext } from "@/app/layout";
import { Stack } from "@mantine/core";
import EditItem from "../EditItem";
import useSWR from "swr";
import { sortObjectArray } from "@/app/lib/helpers";
import { handleItemFavoriteClick, handleDelete } from "../handlers";
import { v4 } from "uuid";
import { fetcher } from "@/app/lib/fetcher";

const Page = ({ params: { id } }) => {
  const { user } = useUser();
  const [lightBoxOpen, setLightboxOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const { isSafari, isMobile, setCrumbs, setCurrentModal, open, close } =
    useContext(DeviceContext);
  const { data, error, isLoading } = useSWR(`/items/api/${id}`, fetcher);

  const onLightboxClick = (clickedIndex) => {
    setIndex(clickedIndex);
    setLightboxOpen(true);
  };

  useEffect(() => {
    setCrumbs(<BreadcrumbTrail data={{ ...data, type: "item" }} />);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const stackValues = [
    { label: "Description", value: data?.description },
    { label: "Purchased at", value: data?.purchasedAt },
    { label: "Quantity", value: data?.quantity },
    { label: "Value", value: data?.value },
    { label: "Serial number", value: data?.serialNumber },
  ];

  const onEditItem = () => {
    setCurrentModal({
      component: (
        <EditItem
          item={data}
          close={close}
          mutateKey={`/items/api/${id}`}
          user={user}
        />
      ),
      size: isMobile ? "xl" : "75%",
    }),
      open();
  };

  if (isLoading) return <Loading />;
  if (error) return <div>Something went wrong</div>;

  return (
    <>
      <div className="flex flex-col md:flex-row gap-8 mt-3">
        <div className="w-full md:w-[60%]">
          <div className="flex gap-3 items-center">
            <h1 className="font-bold text-4xl pb-3 flex gap-2 items-center">
              {data?.name}{" "}
              <Favorite
                onClick={() =>
                  handleItemFavoriteClick({
                    data,
                    mutateKey: `/items/api/${id}`,
                  })
                }
                item={data}
                size={26}
              />
            </h1>
          </div>
          <div className="flex gap-1 flex-wrap">
            {sortObjectArray(data?.categories)?.map((category) => {
              return <CategoryPill category={category} key={v4()} />;
            })}
          </div>
          <Stack justify="flex-start" gap={10} my={30}>
            {stackValues
              ?.filter((field) => field.value)
              .map(({ label, value }) => {
                return (
                  <div key={label}>
                    <span className="font-medium mr-2">{label}:</span>
                    {value}
                  </div>
                );
              })}
          </Stack>
        </div>
        <div className="w-full md:w-[40%]">
          <ImageCarousel data={data?.images} onClick={onLightboxClick} />
          <ImageLightbox
            open={lightBoxOpen}
            setOpen={setLightboxOpen}
            images={data?.images}
            index={index}
          />
        </div>
      </div>

      <ContextMenu
        onDelete={() =>
          handleDelete({
            isSafari,
            data,
            mutateKey: "/items/api?search=",
            user,
          })
        }
        onEdit={onEditItem}
        type="item"
        name={data?.name}
      />
    </>
  );
};

export default Page;
