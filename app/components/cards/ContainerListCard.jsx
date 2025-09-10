import {
  BaseListCard,
  ContainerForm,
  CountsPopup,
  ListViewBreadcrumbs,
} from "..";

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
  textWidth,
}) => {
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
      textWidth={textWidth}
      pillCounts={
        <CountsPopup
          itemCount={container?.itemCount ?? container?._count?.items}
          containerCount={
            container?.containerCount ?? container?._count?.containers
          }
          showPopup={width < 600 || false}
        />
      }
      breadcrumbs={
        showLocation ? (
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
