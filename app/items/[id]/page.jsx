"use client";
import { Image } from "@mantine/core";
import { deleteItem } from "../api/db";
import toast from "react-hot-toast";
import EditItem from "../EditItem";
import ContextMenu from "@/app/components/ContextMenu";
import useSWR, { mutate } from "swr";
import { useUser } from "@/app/hooks/useUser";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { sortObjectArray } from "@/app/lib/helpers";
import { useDisclosure } from "@mantine/hooks";
import CategoryPill from "@/app/components/CategoryPill";
import { v4 } from "uuid";
import Loading from "@/app/components/Loading";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import LocationCrumbs from "@/app/components/LocationCrumbs";

const fetcher = async (id) => {
  const res = await fetch(`/items/api/${id}`);
  const data = await res.json();
  return data.item;
};

const Page = ({ params: { id } }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const { user } = useUser();

  const { data, error, isLoading } = useSWR(`item${id}`, () => fetcher(id));
  if (error) return <div>failed to load</div>;

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

  if (isLoading) return <Loading />;

  let ancestors = data?.container?.id
    ? [{ id: data?.container?.id, name: data?.container?.name }]
    : [];
  const getAncestors = (container) => {
    if (container?.parentContainer?.id) {
      ancestors.unshift({
        id: container.parentContainer.id,
        name: container.parentContainer.name,
      });
      if (container?.parentContainer?.parentContainer?.id) {
        getAncestors(container.parentContainer);
      }
    }
    return ancestors;
  };

  getAncestors(data?.container);

  return (
    <div>
      {ancestors?.length || data.location?.id ? (
        <LocationCrumbs
          name={data?.name}
          location={data?.location}
          ancestors={ancestors}
        />
      ) : null}
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-[60%]">
          <div className="flex gap-3 items-center">
            <h1 className="font-semibold text-3xl pb-3 flex gap-2 items-center">
              {data?.name}
            </h1>
          </div>
          <div className="flex gap-1">
            {sortObjectArray(data?.categories)?.map((category) => {
              return <CategoryPill category={category} key={v4()} />;
            })}
          </div>
          <div>{data?.description}</div>
          <div>{data?.quantity}</div>
          <div>{data?.value}</div>
          <div>{data?.purchasedAt}</div>
          <div>{data?.serialNumber}</div>
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

      <ContextMenu onDelete={handleDelete} onEdit={open} type="item" />
    </div>
  );
};

export default Page;
