import ContainerCard from "@/app/components/ContainerCard";
import ItemGrid from "@/app/components/ItemGrid";
import { sortObjectArray } from "@/app/lib/helpers";

const AllContainers = ({ data, filter }) => {
  // todo: make this recursive
  let containerList = [];
  data?.containers?.forEach((container) => {
    containerList.push(container);
    if (container?.containers) {
      container.containers.forEach((container) => {
        containerList.push(container);
        if (container?.containers) {
          container.containers.forEach((container) => {
            containerList.push(container);
            if (container?.containers) {
              container.containers.forEach((container) => {
                containerList.push(container);
              });
            }
          });
        }
      });
    }
  });

  const filteredResults = containerList?.filter((container) =>
    container?.name?.toLowerCase().includes(filter.toLowerCase())
  );
  const sorted = sortObjectArray(filteredResults);
  return (
    <ItemGrid desktop={4} gap={3}>
      {sorted?.map((container) => {
        return <ContainerCard key={container?.name} container={container} />;
      })}
    </ItemGrid>
  );
};

export default AllContainers;
