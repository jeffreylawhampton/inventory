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
        root: `${rootClasses} max-lg:!p-3`,
        label: "text-sm lg:text-base",
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
