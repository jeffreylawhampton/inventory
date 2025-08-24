import BaseListCard from "./BaseListCard";
import ContainerForm from "./forms/ContainerForm";
import ListViewBreadcrumbs from "./navigation/ListViewBreadcrumbs";
import CountsPopup from "./CountsPopup";

const ContainerListCard = ({
  container,
  showDelete,
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
  return (
    <BaseListCard
      item={{ ...container, data }}
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
          itemCount={container?.itemCount ?? container?._count?.items}
          containerCount={
            container?.containerCount ?? container?._count?.containers
          }
          showPopup={width < 560 || false}
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
