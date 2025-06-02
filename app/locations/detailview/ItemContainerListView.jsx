import ItemCard from "./ItemCard";
import ColorCard from "./ColorCard";
const ItemContainerListView = ({ data, fetchKey }) => {
  return (
    <>
      {data?.items?.map((item) => (
        <ItemCard
          item={item}
          key={`mainpage${item.name}`}
          data={data}
          fetchKey={fetchKey}
        />
      ))}
      {data?.containers?.map((container) => {
        return (
          <ColorCard
            container={container}
            key={`mainpage${container.name}`}
            data={data}
            fetchKey={fetchKey}
          />
        );
      })}
    </>
  );
};

export default ItemContainerListView;
