import { toggleFavorite, deleteMany, deleteObject } from "../lib/db";
import { mutate } from "swr";
import { sortObjectArray, buildContainerTree } from "../lib/helpers";
import { notify } from "../lib/handlers";

export const handleDeleteMany = async ({
  data,
  selectedContainers,
  setSelectedContainers,
  setShowDelete,
  mutateKey,
}) => {
  const optimistic = structuredClone(data)?.filter(
    (c) => !selectedContainers.includes(c.id)
  );
  try {
    await mutate(
      mutateKey,
      deleteMany({ selected: selectedContainers, type: "container" }),
      {
        optimisticData: optimistic,
        populateCache: false,
        revalidate: true,
        rollbackOnError: true,
      }
    );
    setSelectedContainers([]);
    setShowDelete(false);
    notify({
      message: `Deleted ${selectedContainers?.length} ${
        selectedContainers?.length === 1 ? "container" : "containers"
      }`,
    });
  } catch (e) {
    notify({ isError: true });
    throw e;
  }
};

export const handleFavoriteClick = async ({ data, mutateKey }) => {
  const add = !data.favorite;

  try {
    await mutate(
      mutateKey,
      toggleFavorite({ type: "container", id: data.id, add }),
      {
        optimisticData: { ...data, favorite: add },
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      }
    );
    notify({
      message: s(
        add
          ? `Added ${data.name} to favorites`
          : `Removed ${data.name} from favorites`
      ),
    });
  } catch (e) {
    notify({ isError: true });
    throw new Error(e);
  }
};

export const handleDelete = async ({ data, mutateKey, isSafari }) => {
  if (
    !isSafari &&
    !confirm(
      `Are you sure you want to delete ${data?.name || "this container"}?`
    )
  )
    return;
  try {
    await mutate(
      mutateKey,
      deleteObject({ id: data.id, type: "container", navigate: "/containers" })
    );
    notify({ message: `Deleted ${data?.name}` });
  } catch (e) {
    notify({ isError: true });
    throw e;
  }
};

export const handleNestedItemFavoriteClick = async ({
  item,
  data,
  setContainerList,
}) => {
  const add = !item.favorite;
  const updated = [...data];
  const itemContainer = updated?.find(
    (container) => container.id === item.containerId
  );

  const itemToUpdate = itemContainer?.items?.find((i) => i.id === item.id);
  if (itemToUpdate) {
    itemToUpdate.favorite = add;
  }

  try {
    if (
      await mutate(
        "/containers/api",
        toggleFavorite({ type: "item", id: item.id, add }),
        {
          optimisticData: updated,
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      )
    ) {
      setContainerList(updated);
      notify({
        message: add
          ? `Added ${item.name} to favorites`
          : `Removed ${item.name} from favorites`,
      });
    }
  } catch (e) {
    notify({ isError: true });
    throw new Error(e);
  }
};

export const handleItemFavorite = async ({
  data,
  item,
  mutateKey,
  setResults,
}) => {
  const add = !item.favorite;
  const updated = { ...data };

  if (item.containerId === data.id) {
    const itemToUpdate = updated.items.find((i) => i.id === item.id);
    itemToUpdate.favorite = add;
  } else {
    const itemContainer = data.containers?.find(
      (con) => con.id === item.containerId
    );
    const itemToUpdate = itemContainer.items.find((i) => i.id === item.id);
    itemToUpdate.favorite = add;
  }

  try {
    await mutate(
      mutateKey,
      toggleFavorite({ type: "item", id: item.id, add }),
      {
        optimisticData: updated,
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      }
    );
    setResults(
      sortObjectArray(buildContainerTree(updated?.containers, data.id))
    );
    return notify({
      message: add
        ? `Added ${item.name} to favorites`
        : `Removed ${item.name} from favorites`,
    });
  } catch (e) {
    notify({ isError: true });
    throw new Error(e);
  }
};

export const handleContainerFavorite = async ({
  container,
  data,
  mutateKey,
  setResults,
}) => {
  const add = !container.favorite;
  let optimisticData = { ...data };
  const containerToUpdate = optimisticData?.containers?.find(
    (con) => con.name === container.name
  );
  containerToUpdate.favorite = add;

  try {
    await mutate(
      mutateKey,
      toggleFavorite({ type: "container", id: container.id, add }),
      {
        optimisticData: optimisticData,
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      }
    );
    setResults(
      sortObjectArray(buildContainerTree(optimisticData?.containers, data.id))
    );
    notify({
      message: add
        ? `Added ${container.name} to favorites`
        : `Removed ${container.name} from favorites`,
    });
  } catch (e) {
    notify({ isError: true });
    throw new Error(e);
  }
};

export const handleAllContainerFavorite = async ({
  container,
  data,
  setContainerList,
}) => {
  const add = !container.favorite;
  const containerArray = [...data];
  const containerToUpdate = containerArray.find(
    (i) => i.name === container.name
  );
  containerToUpdate.favorite = !container.favorite;

  try {
    if (
      await mutate(
        "/containers/api",
        toggleFavorite({ type: "container", id: container.id, add }),
        {
          optimisticData: containerArray,
          rollbackOnError: true,
          populateCache: false,
          revalidate: true,
        }
      )
    ) {
      setContainerList(containerArray);
      notify({
        message: add
          ? `Added ${container.name} to favorites`
          : `Removed ${container.name} from favorites`,
      });
    }
  } catch (e) {
    notify({ isError: true });
    throw new Error(e);
  }
};
