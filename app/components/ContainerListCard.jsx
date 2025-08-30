import BaseListCard from "./BaseListCard";
import ContainerForm from "./forms/ContainerForm";
import CountsPopup from "./CountsPopup";
import ListViewBreadcrumbs from "./navigation/ListViewBreadcrumbs";

const ContainerListCard = ({
  container,
  isSelected,
  handleClick,
  data,
  showLocation,
  handleFavoriteClick,
  handleUpdateContainer,
  handleDeleteClick,
  mutateKey,
  isLocation,
  width,
}) => {
  const directItems = container?._count?.items ?? 0;
  const rolledItems =
    typeof container?.itemCount === "number" ? container.itemCount : undefined;
  const itemCount =
    rolledItems != null ? Math.max(rolledItems, directItems) : directItems;

  const directContainers = container?._count?.containers ?? 0;
  const rolledContainers =
    typeof container?.containerCount === "number"
      ? container.containerCount
      : undefined;
  const containerCount =
    rolledContainers != null
      ? Math.max(rolledContainers, directContainers)
      : directContainers;

  return (
    <BaseListCard
      item={container}
      data={data}
      type="container"
      name={container.name}
      isSelected={isSelected}
      handleClick={handleClick}
      handleFavoriteClick={handleFavoriteClick}
      handleUpdate={handleUpdateContainer}
      handleDeleteClick={handleDeleteClick}
      mutateKey={mutateKey}
      pillCounts={
        <CountsPopup
          itemId={container?.id}
          itemCount={itemCount}
          containerCount={containerCount}
          showPopup={width < 600 || false}
        />
      }
      breadcrumbs={
        showLocation &&
        (container?.locationId || container?.parentContainerId) ? (
          <ListViewBreadcrumbs
            data={{ ...container, type: "container" }}
            showAll
            isLocation={isLocation}
          />
        ) : null
      }
      formComponent={({ item, close, data, handleSubmit }) => (
        <ContainerForm
          container={item}
          close={close}
          data={data}
          handleSubmit={handleSubmit}
          formError={false}
          setFormError={() => {}}
        />
      )}
    />
  );
};

export default ContainerListCard;
