import CountPills from "./CountPills";

const HoverColorCard = ({ item, type }) => {
  return (
    <>
      <h2 className="font-semibold leading-tight hyphens-auto text-pretty !break-words mb-2 pl-1">
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
      />
    </>
  );
};

export default HoverColorCard;
