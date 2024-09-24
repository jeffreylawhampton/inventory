"use client";
import { useState, useEffect } from "react";
import { useUserColors } from "@/app/hooks/useUserColors";
import useSWR, { mutate } from "swr";
import { deleteContainer } from "../api/db";
import toast from "react-hot-toast";
import EditContainer from "../EditContainer";
import ContextMenu from "@/app/components/ContextMenu";
import AddRemoveModal from "@/app/components/AddRemoveModal";
import Nested from "./Nested";
import AllItems from "./AllItems";
import AllContainers from "./AllContainers";
import { useDisclosure } from "@mantine/hooks";
import { Anchor, Breadcrumbs, ColorSwatch } from "@mantine/core";
import SearchFilter from "@/app/components/SearchFilter";
import ViewToggle from "@/app/components/ViewToggle";
import UpdateColor from "@/app/components/UpdateColor";
import { updateContainerColor } from "../api/db";
import Loading from "@/app/components/Loading";
import Tooltip from "@/app/components/Tooltip";
import LocationCrumbs from "@/app/components/LocationCrumbs";
import { IconBox, IconChevronRight } from "@tabler/icons-react";
import { breadcrumbStyles } from "@/app/lib/styles";

const fetcher = async (id) => {
  const res = await fetch(`/containers/api/${id}`);
  const data = await res.json();
  return data?.container;
};

const Page = ({ params: { id } }) => {
  const { data, error, isLoading } = useSWR(`container${id}`, () =>
    fetcher(id)
  );
  const [filter, setFilter] = useState("");
  const [showItemModal, setShowItemModal] = useState(false);
  const [isRemove, setIsRemove] = useState(false);
  const [color, setColor] = useState();
  const [showPicker, setShowPicker] = useState(false);
  const [view, setView] = useState(0);

  const [opened, { open, close }] = useDisclosure();
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

  if (isLoading) return <Loading />;

  return (
    <>
      {data?.location?.id || ancestors?.length ? (
        <LocationCrumbs
          name={data?.name}
          location={data?.location}
          ancestors={ancestors}
        />
      ) : (
        <Breadcrumbs
          separatorMargin={6}
          separator={
            <IconChevronRight
              size={breadcrumbStyles.separatorSize}
              className={breadcrumbStyles.separatorClasses}
              strokeWidth={breadcrumbStyles.separatorStroke}
            />
          }
          classNames={breadcrumbStyles.breadCrumbClasses}
        >
          <Anchor href={"/containers"}>
            <IconBox
              size={24}
              aria-label="Containers"
              className={breadcrumbStyles.iconColor}
            />
          </Anchor>
          <span>{data?.name}</span>
        </Breadcrumbs>
      )}
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
      <ViewToggle
        active={view}
        setActive={setView}
        data={["Nested", "All items", "All containers"]}
      />
      {view != 0 && (
        <SearchFilter
          label={`Search for an ${view === 1 ? "item" : "container"}`}
          onChange={(e) => setFilter(e.target.value)}
          filter={filter}
          classNames="mb-2"
        />
      )}

      {!view ? (
        <Nested
          data={data}
          filter={filter}
          handleAdd={handleAdd}
          mutate={mutate}
        />
      ) : null}

      {view === 1 ? (
        <AllItems filter={filter} handleAdd={handleAdd} id={id} />
      ) : null}

      {view === 2 ? <AllContainers filter={filter} id={id} /> : null}

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
