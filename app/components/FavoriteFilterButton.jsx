import { Button } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

const FavoriteFilterButton = ({
  showFavorites,
  setShowFavorites,
  label,
  rootClasses,
  iconClasses,
  labelClasses,
}) => {
  return (
    <Button
      variant={showFavorites ? "filled" : "outline"}
      onClick={() => setShowFavorites(!showFavorites)}
      classNames={{
        root: rootClasses,
      }}
      rightSection={
        showFavorites ? (
          <IconX
            aria-label="Clear"
            size={18}
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
