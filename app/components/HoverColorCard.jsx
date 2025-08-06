import CountPills from "./CountPills";

const HoverColorCard = ({ item, type, handleClick }) => {
  return (
    <div onClick={() => handleClick(item)}>
      <h2 className="font-semibold leading-tight mb-2 whitespace-nowrap">
        {item?.name}
      </h2>
      <CountPills
        item={item}
        showFavorite
        transparent
        red={false}
        showEmpty
        showContainers={type === "container"}
        showItems
        containerCount={item?.containerCount}
        itemCount={item?.itemCount}
        className="mt-3"
        pl=""
      />
    </div>
  );
};

export default HoverColorCard;
