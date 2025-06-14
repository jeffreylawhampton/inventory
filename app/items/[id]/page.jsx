"use client";
import { useContext, useEffect } from "react";
import { useUser } from "@/app/hooks/useUser";
import { useDisclosure } from "@mantine/hooks";
import {
  BreadcrumbTrail,
  CategoryPill,
  ContextMenu,
  Loading,
} from "@/app/components";
import { DeviceContext } from "@/app/layout";
import { Image, Stack } from "@mantine/core";
import { deleteObject } from "@/app/lib/db";
import EditItem from "../EditItem";
import useSWR, { mutate } from "swr";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { sortObjectArray } from "@/app/lib/helpers";
import { v4 } from "uuid";
import { toggleFavorite } from "@/app/lib/db";
import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
import toast from "react-hot-toast";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const fetcher = async (id) => {
  const res = await fetch(`/items/api/${id}`);
  const data = await res.json();
  return data.item;
};

const Page = ({ params: { id } }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { user } = useUser();
  const { isSafari, setCrumbs, crumbs } = useContext(DeviceContext);
  const { data, error, isLoading } = useSWR(`item${id}`, () => fetcher(id));

  const handleFavoriteClick = async () => {
    const add = !data.favorite;
    try {
      await mutate(
        `item${id}`,
        toggleFavorite({ type: "item", id: data.id, add }),
        {
          optimisticData: {
            ...data,
            favorite: add,
          },
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      toast.success(
        add
          ? `Added ${data.name} to favorites`
          : `Removed ${data.name} from favorites`
      );
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
  };

  const handleDelete = async () => {
    if (
      !isSafari &&
      !confirm(`Are you sure you want to delete ${data?.name || "this item"}?`)
    )
      return;
    try {
      await mutate(
        `/items/api?search=`,
        deleteObject({ id, type: "item", navigate: "/items" }),
        {
          optimisticData: user?.items?.filter((item) => item.id != id),
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      toast.success(`Successfully deleted ${data?.name}`);
    } catch (e) {
      toast.error("Something went wrong");
      throw e;
    }
  };

  useEffect(() => {
    setCrumbs(<BreadcrumbTrail data={{ ...data, type: "item" }} />);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  if (isLoading) return <Loading />;
  if (error) return <div>Something went wrong</div>;

  return (
    <>
      <div className="flex flex-col md:flex-row gap-8 mt-3">
        <div className="w-full md:w-[60%]">
          <div className="flex gap-3 items-center">
            <h1 className="font-bold text-4xl pb-3 flex gap-2 items-center">
              {data?.name}{" "}
              <div onClick={handleFavoriteClick}>
                {data?.favorite ? (
                  <IconHeartFilled size={26} className="text-danger-400" />
                ) : (
                  <IconHeart className="text-bluegray-500 hover:text-danger-200" />
                )}
              </div>
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

      {opened ? (
        <EditItem
          item={data}
          opened={opened}
          close={close}
          open={open}
          user={user}
          id={id}
        />
      ) : null}

      <ContextMenu
        onDelete={handleDelete}
        onEdit={open}
        type="item"
        name={data?.name}
      />
    </>
  );
};

export default Page;
