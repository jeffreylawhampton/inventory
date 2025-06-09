"use client";
import { useContext, useEffect } from "react";
import { useUser } from "@/app/hooks/useUser";
import { useDisclosure } from "@mantine/hooks";
import {
  BreadcrumbTrail,
  CategoryPill,
  ContextMenu,
  Favorite,
  Loading,
} from "@/app/components";
import { DeviceContext } from "@/app/layout";
import { Image, Stack } from "@mantine/core";
import EditItem from "../EditItem";
import useSWR from "swr";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { sortObjectArray } from "@/app/lib/helpers";
import { handleItemFavoriteClick, handleDelete } from "../handlers";
import { v4 } from "uuid";
import { fetcher } from "@/app/lib/fetcher";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const Page = ({ params: { id } }) => {
  // const [opened, { open, close }] = useDisclosure(false);
  const { user } = useUser();
  const { isSafari, isMobile, setCrumbs, setCurrentModal, open, close } =
    useContext(DeviceContext);
  const { data, error, isLoading } = useSWR(`/items/api/${id}`, fetcher);

  useEffect(() => {
    setCrumbs(<BreadcrumbTrail data={{ ...data, type: "item" }} />);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

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
            {data?.description ? (
              <div>
                <span className="font-medium mr-2">Description:</span>
                {data.description}
              </div>
            ) : null}

            {data?.purchasedAt ? (
              <div>
                <span className="font-medium mr-2">Purchased at:</span>
                {data.purchasedAt}
              </div>
            ) : null}

            {data?.quantity ? (
              <div>
                <span className="font-medium mr-2">Quantity:</span>
                {data.quantity}
              </div>
            ) : null}

            {data?.value ? (
              <div>
                <span className="font-medium mr-2">Value:</span>
                {data.value}
              </div>
            ) : null}

            {data?.serialNumber ? (
              <div>
                <span className="font-medium mr-2">Serial number:</span>
                {data.serialNumber}
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
            loop={data?.images?.length > 1}
            style={{
              "--swiper-navigation-color": "#fff",
              "--swiper-pagination-color": "#ececec",
            }}
          >
            {data?.images?.map((image) => {
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

      {/* {opened ? (
        <EditItem
          item={data}
          opened={opened}
          close={close}
          open={open}
          user={user}
          id={id}
        />
      ) : null} */}

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
