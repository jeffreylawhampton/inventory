import CountPills from "./CountPills";

const HoverColorCard = ({ item, type, handleClick }) => {
  return (
    <div onClick={() => handleClick(item)}>
      <h2 className="font-semibold leading-tight mb-2 whitespace-nowrap">
        {item?.name}
      </h2>
      <CountPills
        item={item}
        handleFavoriteClick={() => handleClick(item)}
        showFavorite={type != "location"}
        transparent
        red={false}
        showEmpty
        showContainers={type === "container" || type === "location"}
        showItems
        containerCount={item?.containerCount ?? item?._count?.containers}
        itemCount={item?.itemCount ?? item?._count?.items}
        className="mt-3"
        pl=""
      />
    </div>
  );
};

export default HoverColorCard;
