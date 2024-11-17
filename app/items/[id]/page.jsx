"use client";
import { Image, Stack } from "@mantine/core";
import { deleteItem } from "../api/db";
import EditItem from "../EditItem";
import ContextMenu from "@/app/components/ContextMenu";
import useSWR, { mutate } from "swr";
import { useUser } from "@/app/hooks/useUser";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
import { sortObjectArray } from "@/app/lib/helpers";
import { useDisclosure } from "@mantine/hooks";
import CategoryPill from "@/app/components/CategoryPill";
import LocationCrumbs from "@/app/components/LocationCrumbs";
import { v4 } from "uuid";
import Loading from "@/app/components/Loading";
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

  const { data, error, isLoading } = useSWR(`item${id}`, () => fetcher(id));
  if (error) return <div>failed to load</div>;

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
    // if (
    //   !confirm(`Are you sure you want to delete ${data?.name || "this item"}?`)
    // )
    //   return;
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
    ? [{ id: data.container?.id, name: data.container.name }]
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
      {ancestors?.length || data?.location?.id ? (
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

      <ContextMenu onDelete={handleDelete} onEdit={open} type="item" />
    </div>
  );
};

export default Page;
