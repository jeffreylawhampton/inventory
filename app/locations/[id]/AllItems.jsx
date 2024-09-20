import ItemCard from "@/app/components/ItemCard";
import ItemGrid from "@/app/components/ItemGrid";
import { sortObjectArray } from "@/app/lib/helpers";

const AllItems = ({ data, filter, handleAdd }) => {
  const filteredResults = data?.items?.filter((item) =>
    item?.name?.toLowerCase().includes(filter.toLowerCase())
  );
  const sorted = sortObjectArray(filteredResults);
  return (
    <ItemGrid desktop={3}>
      {!data?.items?.length ? <Empty onClick={handleAdd} /> : null}
      {sorted?.map((item) => {
        return <ItemCard key={item?.name} item={item} />;
      })}
    </ItemGrid>
  );
};

export default AllItems;
