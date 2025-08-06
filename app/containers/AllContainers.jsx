import { useContext } from "react";
import { useRouter } from "next/navigation";
import { mutate } from "swr";
import {
  ColorCard,
  ContainerListCard,
  GridLayout,
  ThumbnailCard,
  ThumbnailGrid,
} from "@/app/components";
import {
  buildContainerTree,
  handleToggleSelect,
  sortObjectArray,
} from "../lib/helpers";
import { DeviceContext } from "../providers";
import { updateContainer } from "./api/db";
import { deleteObject } from "../lib/db";
import { ScrollArea } from "@mantine/core";

const AllContainers = ({
  containerList,
  filter,
  handleContainerFavoriteClick,
  handleSelect,
  selectedContainers,
  setSelectedContainers,
  data,
  showDelete,
}) => {
  const { view, close } = useContext(DeviceContext);
  const router = useRouter();

  let filteredResults = buildContainerTree(containerList);

  filteredResults = sortObjectArray(
    containerList?.filter((container) =>
      container?.name.toLowerCase().includes(filter?.toLowerCase())
    )
  );

  const handleUpdateContainer = async (container) => {
    try {
      await mutate("/containers/api", updateContainer(container), {
        optimisticData: data?.map((c) =>
          c.id === container?.id ? { ...c, ...container } : c
        ),
        rollbackOnError: true,
        populateCache: false,
        revalidate: true,
      });
      close();
    } catch (e) {
      throw new Error(e);
    }
  };

  const handleDeleteClick = async (container) => {
    if (confirm(`Delete ${container.name}?`)) {
      try {
        await mutate(
          "/containers/api",
          deleteObject({ id: container.id, type: "container" }),
          {
            optimisticData: data?.filter((c) => c.id != container.id),
            rollbackOnError: true,
            populateCache: false,
            revalidate: true,
          }
        );
      } catch (e) {
        throw new Error(e);
      }
    }
  };

  const handleClick = (container) => {
    showDelete
      ? handleToggleSelect(
          container.id,
          selectedContainers,
          setSelectedContainers
        )
      : router.push(`/containers/${container.id}`);
  };

  return (
    <>
      {!view ? (
        <ThumbnailGrid>
          {sortObjectArray(filteredResults)?.map((container) => {
            return (
              <ThumbnailCard
                key={container.name}
                item={container}
                type="container"
                path={`/containers/${container.id}`}
                showDelete={showDelete}
                isSelected={selectedContainers?.includes(container.id)}
                handleSelect={handleSelect}
                handleClick={handleClick}
              />
            );
          })}
        </ThumbnailGrid>
      ) : null}

      {view === 1 ? (
        <GridLayout>
          {filteredResults?.map((container) => {
            return (
              <ColorCard
                item={container}
                type="container"
                key={container.name}
                handleFavoriteClick={handleContainerFavoriteClick}
                showDelete={showDelete}
                isSelected={selectedContainers?.includes(container.id)}
                handleSelect={handleSelect}
              />
            );
          })}
        </GridLayout>
      ) : null}

      {view === 2 ? (
        <ScrollArea
          w="100%"
          scrollbars="x"
          type="hover"
          offsetScrollbars="x"
          classNames={{
            root: "list !text-[15px] font-medium ",
          }}
        >
          <div className="table w-max min-w-full">
            {filteredResults?.map((container) => {
              return (
                <div className="table-row" key={container.name}>
                  <ContainerListCard
                    container={container}
                    showDelete={showDelete}
                    isSelected={selectedContainers?.includes(container.id)}
                    data={data}
                    handleClick={handleClick}
                    showLocation
                    handleFavoriteClick={handleContainerFavoriteClick}
                    handleDeleteClick={handleDeleteClick}
                    handleUpdateContainer={handleUpdateContainer}
                    mutateKey="/containers/api"
                  />
                </div>
              );
            })}
          </div>
        </ScrollArea>
      ) : null}
    </>
  );

  // return view ? (
  //   <GridLayout>
  //     {filteredResults?.map((container) => {
  //       return (
  //         <ColorCard
  //           item={container}
  //           type="container"
  //           key={container.name}
  //           handleFavoriteClick={handleContainerFavoriteClick}
  //           showDelete={showDelete}
  //           isSelected={selectedContainers?.includes(container.id)}
  //           handleSelect={handleSelect}
  //         />
  //       );
  //     })}
  //   </GridLayout>
  // ) : (
  //   <ThumbnailGrid>
  //     {sortObjectArray(filteredResults)?.map((container) => {
  //       return (
  //         <ThumbnailCard
  //           key={container.name}
  //           item={container}
  //           type="container"
  //           path={`/containers/${container.id}`}
  //           showDelete={showDelete}
  //           isSelected={selectedContainers?.includes(container.id)}
  //           handleSelect={handleSelect}
  //         />
  //       );
  //     })}
  //   </ThumbnailGrid>
  // );
};

export default AllContainers;
