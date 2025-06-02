"use client";
import { CategoryPill } from "@/app/components";
import { Image, Stack } from "@mantine/core";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { sortObjectArray } from "@/app/lib/helpers";
import { v4 } from "uuid";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const ItemPage = ({ item }) => {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-8 mt-[-10px]">
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
          <Swiper
            modules={[Pagination, Navigation]}
            className="mySwiper"
            centeredSlides={true}
            navigation={true}
            pagination={{ clickable: true }}
            loop={item?.images?.length > 1}
            style={{
              "--swiper-navigation-color": "#fff",
              "--swiper-pagination-color": "#ececec",
            }}
          >
            {item?.images?.map((image) => {
              return (
                <SwiperSlide key={image.url}>
                  <div className="swiper-zoom-container">
                    <Image
                      alt=""
                      width="100%"
                      height="auto"
                      classNames={{
                        root: "!rounded-xl",
                      }}
                      src={image.secureUrl}
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </>
  );
};

export default ItemPage;
