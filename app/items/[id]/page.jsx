"use client";
import { useState } from "react";
import { Button, Chip, Image, Spinner, useDisclosure } from "@nextui-org/react";
import { deleteItem } from "../api/db";
import toast from "react-hot-toast";
import EditItem from "../EditItem";
import useSWR, { mutate } from "swr";
import { useUser } from "@/app/hooks/useUser";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { getFontColor, sortObjectArray } from "@/app/lib/helpers";
import ContextMenu from "@/app/components/ContextMenu";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const fetcher = async (id) => {
  const res = await fetch(`/items/api/${id}`);
  const data = await res.json();
  return data.item;
};

const Page = ({ params: { id } }) => {
  const [showMoveItem, setShowMoveItem] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { user } = useUser();

  const { data, error, isLoading } = useSWR(`item${id}`, () => fetcher(id));
  if (error) return <div>failed to load</div>;

  if (isLoading)
    return (
      <div className="absolute top-0 left-0 mx-auto w-full h-full flex items-center justify-center">
        <Spinner size="lg" aria-label="Loading" />
      </div>
    );

  const handleDelete = async () => {
    if (
      !confirm(`Are you sure you want to delete ${data?.name || "this item"}?`)
    )
      return;
    try {
      await mutate(`/items/api?search=`, deleteItem({ id }), {
        optimisticData: user?.items?.filter((item) => item.id != id),
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      toast.success(`Successfully deleted ${data?.name}`);
    } catch (e) {
      toast.error("Something went wrong");
      throw e;
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-[60%]">
          <div className="flex gap-3 items-center">
            <h1 className="font-semibold text-3xl pb-3 flex gap-2 items-center">
              {data?.name}
            </h1>
          </div>
          <div className="flex gap-1">
            {sortObjectArray(data?.categories).map((category) => {
              return (
                <Chip
                  style={{
                    backgroundColor: category?.color,
                  }}
                  classNames={{
                    content: `text-[12px] font-medium ${getFontColor(
                      category?.color
                    )}`,
                    base: "rounded-lg",
                  }}
                  key={category?.name}
                >
                  <Link
                    href={`/categories/${category?.id}?name=${category?.name}`}
                  >
                    {category?.name}
                  </Link>
                </Chip>
              );
            })}
          </div>
          <div>{data?.description}</div>
          <div>{data?.quantity}</div>
          <div>{data?.value}</div>
          <div>{data?.purchasedAt}</div>
          <div>{data?.serialNumber}</div>
          <div>
            Location: {data?.location?.name}{" "}
            <Button
              variant="light"
              onPress={() => setShowMoveItem(!showMoveItem)}
            >
              Move
            </Button>
          </div>
          <div>Container: {data?.container?.name}</div>
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
                      src={image.secureUrl}
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>

      <EditItem
        item={data}
        isOpen={isOpen}
        onOpen={onOpen}
        onOpenChange={onOpenChange}
        onClose={onClose}
        user={user}
        id={id}
      />

      <ContextMenu onDelete={handleDelete} onEdit={onOpen} type="item" />
    </div>
  );
};

export default Page;
