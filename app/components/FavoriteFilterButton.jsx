import { Button } from "@mantine/core";
import { X } from "lucide-react";

const FavoriteFilterButton = ({
  showFavorites,
  setShowFavorites,
  label = "Favorites",
  rootClasses,
}) => {
  return (
    <Button
      variant={showFavorites ? "filled" : "outline"}
      onClick={() => setShowFavorites(!showFavorites)}
      color="black"
      classNames={{
        root: `${rootClasses} max-lg:!p-3 !min-w-fit !min-h-[100%]`,
        label: "text-sm lg:text-base",
      }}
      rightSection={
        showFavorites ? (
          <X
            aria-label="Clear"
            size={15}
            onClick={() => setShowFavorites(!showFavorites)}
          />
        ) : null
      }
    >
      {label}
    </Button>
  );
};

export default FavoriteFilterButton;
