"use client";
import { useState, useContext, useEffect } from "react";
import useSWR from "swr";
import { useUser } from "@/app/hooks/useUser";
import {
  BreadcrumbTrail,
  CategoryPill,
  CloudUploadWidget,
  ContextMenu,
  DeleteImages,
  Favorite,
  ImageCarousel,
  ImageLightbox,
  Loading,
  PickerMenu,
  UpdateIcon,
} from "@/app/components";
import { DeviceContext } from "@/app/providers";
import { Stack } from "@mantine/core";
import EditItem from "../EditItem";
import { fetcher, sortObjectArray } from "@/app/lib/helpers";
import { handleItemFavoriteClick, handleDelete } from "../handlers";
import { v4 } from "uuid";

const Page = ({ params: { id } }) => {
  const mutateKey = `/items/api/${id}`;
  const { user } = useUser();
  const [lightBoxOpen, setLightboxOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const {
    isSafari,
    isMobile,
    setCurrentModal,
    open,
    close,
    hideCarouselNav,
    setHideCarouselNav,
  } = useContext(DeviceContext);

  const { data, error, isLoading } = useSWR(mutateKey, fetcher);

  const onLightboxClick = (clickedIndex) => {
    setIndex(clickedIndex);
    setLightboxOpen(true);
  };

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
        <EditItem item={data} close={close} mutateKey={mutateKey} user={user} />
      ),
      size: isMobile ? "xl" : "75%",
    }),
      setHideCarouselNav(true);
    open();
  };

  const handleImageDeletion = () => {
    setCurrentModal({
      component: <DeleteImages item={data} mutateKey={mutateKey} />,
      size: isMobile ? "xl" : "75%",
    });
    open();
  };

  const handleUpdateIcon = () => {
    setCurrentModal({
      component: (
        <UpdateIcon
          data={data}
          type="item"
          close={close}
          mutateKey={mutateKey}
          onSuccess={() => setHideCarouselNav(false)}
        />
      ),
      size: "xl",
      title: null,
    });
    setHideCarouselNav(true);
    open();
  };

  useEffect(() => {
    return setHideCarouselNav(false);
  }, [data, setHideCarouselNav]);

  if (isLoading) return <Loading />;
  if (error) return <div>Something went wrong</div>;

  return (
    <>
      <div className="flex flex-col md:flex-row gap-8 mt-3">
        <div className="w-full md:w-[60%]">
          <div className="flex gap-3 items-center my-3">
            <h1 className="font-bold text-4xl ">{data?.name} </h1>
            <PickerMenu
              opened={false}
              setOpened={() => null}
              data={data}
              type="item"
              handleIconPickerClick={handleUpdateIcon}
              updateColorClick={null}
            />
            <Favorite
              onClick={() =>
                handleItemFavoriteClick({
                  data,
                  mutateKey,
                })
              }
              item={data}
              size={26}
            />
          </div>
          <BreadcrumbTrail data={{ ...data, type: "item" }} />
          <div className="mt-3 flex gap-1 flex-wrap">
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
                    <span className="font-medium mr-2">{label}:</span>${value}
                  </div>
                );
              })}
          </Stack>
        </div>
        <div className="pb-64 lg:pb-12 w-full md:w-[40%]">
          <ImageCarousel
            data={data}
            onClick={onLightboxClick}
            item={data}
            mutateKey={mutateKey}
            showNav={!hideCarouselNav}
          />

          <ImageLightbox
            open={lightBoxOpen}
            setOpen={setLightboxOpen}
            images={data?.images}
            index={index}
          />
        </div>
      </div>

      <CloudUploadWidget item={data} mutateKey={mutateKey}>
        {({ open }) => (
          <button
            id="cloud-upload-trigger"
            style={{ display: "none" }}
            onClick={() => open()}
          />
        )}
      </CloudUploadWidget>

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
        onUpload={true}
        onDeleteImages={data?.images?.length ? handleImageDeletion : null}
        type="item"
        name={data?.name}
      />
    </>
  );
};

export default Page;
