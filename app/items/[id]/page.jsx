"use client";
import { useState } from "react";
import { Button, Chip, Image, Spinner } from "@nextui-org/react";
import { deleteItem } from "../api/db";
import toast from "react-hot-toast";
import EditItem from "../EditItem";
import { Pencil } from "lucide-react";
import useSWR, { mutate } from "swr";
import { useUser } from "@/app/hooks/useUser";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, Zoom } from "swiper/modules";
import { getFontColor } from "@/app/lib/helpers";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/zoom";

const fetcher = async (id) => {
  const res = await fetch(`/items/api/${id}`);
  const data = await res.json();
  return data.item;
};

const Page = ({ params: { id } }) => {
  const [showEditItem, setShowEditItem] = useState(false);
  const [showMoveItem, setShowMoveItem] = useState(false);
  const { user } = useUser();

  const { data, error, isLoading } = useSWR(`item${id}`, () => fetcher(id));
  if (error) return <div>failed to load</div>;
  if (isLoading) return <Spinner aria-label="Loading" />;

  return (
    <div>
      {showEditItem ? (
        <EditItem
          item={data}
          setShowEditItem={setShowEditItem}
          user={user}
          id={id}
        />
      ) : (
        <div className="flex flex-col md:flex-row">
          <div className="w-full md:w-[60%]">
            <div className="flex gap-3 items-center">
              <h1 className="font-semibold text-3xl pb-0">{data?.name}</h1>
              <Pencil onClick={() => setShowEditItem(true)} aria-label="Edit" />
            </div>
            <div className="flex gap-1">
              {data?.categories
                ?.sort((a, b) => a.name.localeCompare(b.name))
                .map((category) => {
                  return (
                    <Chip
                      style={{
                        backgroundColor: category?.color,
                      }}
                      classNames={{
                        content: `text-[12px] font-medium ${getFontColor(
                          category?.color
                        )}`,
                      }}
                      key={category?.name}
                    >
                      <Link
                        href={`/categories/${category.id}?name=${category.name}`}
                      >
                        {category.name}
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

            <Button
              onPress={async () => {
                if (
                  !confirm(
                    `Are you sure you want to delete ${
                      data?.name || "this item"
                    }?`
                  )
                )
                  return;
                try {
                  await mutate(`/items/api?search=`, deleteItem({ id }), {
                    optimisticData: user?.items?.filter(
                      (item) => item.id != id
                    ),
                    rollbackOnError: true,
                    populateCache: false,
                    revalidate: true,
                  });
                  toast.success(`Successfully deleted ${data?.name}`);
                } catch (e) {
                  toast.error("Something went wrong");
                  throw e;
                }
              }}
            >
              Delete item
            </Button>
            <Button
              onPress={() => {
                setShowEditItem(true);
              }}
            >
              Edit
            </Button>
          </div>
          <div className="w-full md:w-[40%]">
            <Swiper
              modules={[Pagination, Navigation, Zoom]}
              className="mySwiper"
              centeredSlides={true}
              navigation={true}
              zoom={true}
              pagination={{ clickable: true }}
              loop={data?.images?.length > 1}
              style={{
                "--swiper-navigation-color": "#fff",
                "--swiper-pagination-color": "#ececec",
              }}
            >
              {data?.images?.map((image) => (
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
              ))}
            </Swiper>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
