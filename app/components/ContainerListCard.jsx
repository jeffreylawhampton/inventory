import BaseListCard from "./BaseListCard";
import ContainerForm from "./forms/ContainerForm";
import ListViewBreadcrumbs from "./navigation/ListViewBreadcrumbs";
import { ListPill } from ".";

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
}) => {
  return (
    <BaseListCard
      item={{ ...container, data }}
      type="container"
      name={container.name}
      isSelected={isSelected}
      showDelete={showDelete}
      handleClick={handleClick}
      handleFavoriteClick={handleFavoriteClick}
      handleUpdate={handleUpdateContainer}
      handleDeleteClick={handleDeleteClick}
      mutateKey={mutateKey}
      pillCounts={
        <div className="flex gap-1 items-center justify-end">
          <ListPill
            count={container?._count?.containers}
            type="container"
            showDelete={showDelete}
          />
          <ListPill
            count={container?._count?.items}
            type="item"
            showDelete={showDelete}
          />
        </div>
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
