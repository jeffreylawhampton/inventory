import { SquareItemCard, ColorCard, MasonryGrid } from "@/app/components";
import { v4 } from "uuid";

const Results = ({ results, handleUnfavorite }) => {
  return (
    <MasonryGrid>
      {results?.map((item) => {
        return item?.hasOwnProperty("containerId") ? (
          <SquareItemCard
            item={item}
            key={v4()}
            handleFavoriteClick={handleUnfavorite}
          />
        ) : (
          <ColorCard
            key={v4()}
            item={item}
            handleFavoriteClick={handleUnfavorite}
            isContainer={item.hasOwnProperty("parentContainerId")}
          />
        );
      })}
    </MasonryGrid>
  );
};

export default Results;
