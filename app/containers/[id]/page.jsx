"use client";
import { useState, useEffect } from "react";
import { useUserColors } from "@/app/hooks/useUserColors";
import { useRouter } from "next/navigation";
import useSWR, { mutate } from "swr";
import { deleteContainer } from "../api/db";
import toast from "react-hot-toast";
import EditContainer from "../EditContainer";
import ContextMenu from "@/app/components/ContextMenu";
import AddRemoveModal from "@/app/components/AddRemoveModal";
import ItemCard from "@/app/components/ItemCard";
import ContainerCard from "@/app/components/ContainerCard";
import { sortObjectArray } from "@/app/lib/helpers";
import { useDisclosure } from "@mantine/hooks";
import { ColorSwatch } from "@mantine/core";
import FilterChip from "@/app/components/Chip";
import { Chip } from "@mantine/core";
import UpdateColor from "@/app/components/UpdateColor";
import { updateContainerColor } from "../api/db";
import Loading from "@/app/components/Loading";
import Tooltip from "@/app/components/Tooltip";
import LocationCrumbs from "@/app/components/LocationCrumbs";
import MasonryContainer from "@/app/components/MasonryContainer";

const fetcher = async (id) => {
  const res = await fetch(`/containers/api/${id}`);
  const data = await res.json();
  return data?.container;
};

const Page = ({ params: { id } }) => {
  const { data, error, isLoading } = useSWR(`container${id}`, () =>
    fetcher(id)
  );

  const [showItemModal, setShowItemModal] = useState(false);
  const [isRemove, setIsRemove] = useState(false);
  const [color, setColor] = useState();
  const [showPicker, setShowPicker] = useState(false);
  const [selected, setSelected] = useState(["containers", "items"]);
  const [opened, { open, close }] = useDisclosure();
  const router = useRouter();
  const { user } = useUserColors();

  const handleRemove = () => {
    setIsRemove(true);
    setShowItemModal(true);
  };

  const handleAdd = () => {
    setIsRemove(false);
    setShowItemModal(true);
  };

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete ${data?.name || "this container"}?`
      )
    )
      return;
    try {
      await mutate("containers", deleteContainer({ id }), {
        optimisticData: user?.containers?.filter(
          (container) => container.id != id
        ),
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      toast.success("Deleted");
    } catch (e) {
      toast.error("Something went wrong");
      throw e;
    }
  };

  let filteredResults = [];

  if (selected.length === 2)
    filteredResults = data?.items?.concat(data?.containers);

  if (selected.length === 1 && selected.includes("containers")) {
    filteredResults = data?.containers;
  } else if (selected.length === 1 && selected.includes("items")) {
    filteredResults = data?.items;
  }

  const handleSetColor = async () => {
    if (data?.color?.hex == color) return setShowPicker(false);

    try {
      await mutate(
        `containers${id}`,
        updateContainerColor({
          id: data.id,
          color,
          userId: data.userId,
        }),
        {
          optimisticData: { ...data, color: { hex: color } },
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      );
      router.replace(`/containers/${id}?name=${data.name}`, {
        shallow: true,
      });

      toast.success("Color updated");
    } catch (e) {
      toast.error("Something went wrong");
      throw new Error(e);
    }
    setShowPicker(false);
  };

  useEffect(() => {
    setColor(data?.color?.hex);
  }, [data]);

  if (error) return <div>failed to fetch</div>;
  if (isLoading) return <Loading />;

  const ancestors = [];
  const getAncestors = (container) => {
    if (container?.parentContainerId) {
      ancestors.unshift(container.parentContainer);
      if (container?.parentContainer?.parentContainerId) {
        getAncestors(container.parentContainer);
      }
    }
  };

  getAncestors(data);

  return (
    <>
      <LocationCrumbs
        name={data?.name}
        location={data?.location}
        ancestors={ancestors}
      />
      <div className="flex gap-3 items-center pb-4">
        <h1 className="font-bold text-3xl pb-0">{data?.name}</h1>
        <Tooltip
          label="Update color"
          textClasses={showPicker ? "hidden" : "!text-black font-medium"}
        >
          <ColorSwatch
            color={color}
            onClick={() => setShowPicker(!showPicker)}
            className="cursor-pointer"
          />
        </Tooltip>

        {showPicker ? (
          <UpdateColor
            data={data}
            handleSetColor={handleSetColor}
            color={color}
            setColor={setColor}
            setShowPicker={setShowPicker}
            colors={user?.colors?.map((color) => color.hex)}
          />
        ) : null}
      </div>
      <div className="flex gap-1">
        <Chip.Group value={selected} onChange={setSelected} multiple>
          <FilterChip value={"containers"}>Containers</FilterChip>
          <FilterChip value={"items"}>Items</FilterChip>
        </Chip.Group>
      </div>

      <MasonryContainer classNames="my-8" gap="6" desktopColumns={3}>
        {sortObjectArray(filteredResults)?.map((cardItem) => {
          return cardItem.hasOwnProperty("parentContainerId") ? (
            <ContainerCard key={cardItem.name} container={cardItem} />
          ) : (
            <ItemCard
              key={cardItem.name}
              item={cardItem}
              showLocation={false}
            />
          );
        })}
      </MasonryContainer>
      <EditContainer
        data={data}
        id={id}
        opened={opened}
        open={open}
        close={close}
      />

      <ContextMenu
        type="container"
        onDelete={handleDelete}
        onEdit={open}
        onAdd={handleAdd}
        onRemove={data?.items?.length ? handleRemove : null}
      />

      <AddRemoveModal
        showItemModal={showItemModal}
        setShowItemModal={setShowItemModal}
        type="container"
        name={data.name}
        itemList={data?.items}
        isRemove={isRemove}
      />
    </>
  );
};

export default Page;
