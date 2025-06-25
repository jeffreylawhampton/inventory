"use client";
import { useState } from "react";
import { CategoryPill, ImageCarousel, ImageLightbox } from "@/app/components";
import { Stack } from "@mantine/core";
import { sortObjectArray } from "@/app/lib/helpers";
import { v4 } from "uuid";

const ItemPage = ({ item, mutateKey, hideCarouselNav }) => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const onClick = (imageIndex) => {
    setIndex(imageIndex);
    setOpen(true);
  };
  return (
    <div className="flex flex-col md:flex-row gap-8 mt-4 pb-64 lg:pb-8">
      <div className="w-full md:w-[60%]">
        <div className="flex gap-1 flex-wrap">
          {sortObjectArray(item?.categories)?.map((category) => {
            return <CategoryPill category={category} key={v4()} />;
          })}
        </div>
        <Stack justify="flex-start" gap={10} my={30}>
          {item?.description ? (
            <div>
              <span className="font-medium mr-2">Description:</span>
              {item.description}
            </div>
          ) : null}

          {item?.purchasedAt ? (
            <div>
              <span className="font-medium mr-2">Purchased at:</span>
              {item.purchasedAt}
            </div>
          ) : null}

          {item?.quantity ? (
            <div>
              <span className="font-medium mr-2">Quantity:</span>
              {item.quantity}
            </div>
          ) : null}

          {item?.value ? (
            <div>
              <span className="font-medium mr-2">Value:</span>
              {item.value}
            </div>
          ) : null}

          {item?.serialNumber ? (
            <div>
              <span className="font-medium mr-2">Serial number:</span>
              {item.serialNumber}
            </div>
          ) : null}
        </Stack>
      </div>
      <div className="w-full md:w-[40%]">
        <ImageCarousel
          data={item}
          onClick={onClick}
          index={index}
          setIndex={setIndex}
          item={item}
          mutateKey={mutateKey}
          showNav={!hideCarouselNav}
          additionalMutate={
            item?.containerId
              ? `/locations?type=container&id=${item?.containerId}`
              : `/locations?type=location&id=${item?.locationId}`
          }
        />
        <ImageLightbox
          open={open}
          setOpen={setOpen}
          images={item?.images}
          index={index}
        />
      </div>
    </div>
  );
};

export default ItemPage;
