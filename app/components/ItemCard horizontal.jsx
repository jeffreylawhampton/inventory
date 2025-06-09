import { useState } from "react";
import { Card, Image } from "@mantine/core";
import CategoryPill from "./CategoryPill";
import DetailsSpoiler from "./DetailsSpoiler";
import Link from "next/link";
import DetailsTrigger from "./DetailsTrigger";
import Favorite from "./Favorite";
import { cardStyles } from "../lib/styles";
import { IconCircle, IconCircleMinus } from "@tabler/icons-react";
import { v4 } from "uuid";

const ItemCard = ({
  item,
  activeItem,
  shadow = "!shadow-sm",
  handleFavoriteClick,
  handleSelect,
  isSelected,
  showDelete,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [bgColor, setBgColor] = useState(cardStyles.defaultBg);

  const handleEnter = () => {
    setBgColor(cardStyles.defaultBg);
  };

  const handleLeave = () => {
    setBgColor(cardStyles.hoverBg);
  };

  return activeItem?.name === item.name ? null : (
    <>
      <Card
        padding="xs"
        radius="md"
        onMouseEnter={() => setBgColor(cardStyles.hoverBg)}
        onMouseLeave={() => setBgColor(cardStyles.defaultBg)}
        // onClick={showDelete ? () => handleSelect(item.id) : null}
        classNames={{
          root: `
          !shadow-md active:!shadow-sm ${bgColor} active:brightness-95 overflow-hidden !px-3 !py-2 relative border-2 ${
            showDelete
              ? !isSelected
                ? "opacity-50"
                : "border-danger-500 box-content"
              : ""
          }`,
        }}
      >
        <Link
          prefetch={false}
          className="w-full h-full absolute top-0 left-0"
          href={`/items/${item.id}`}
        />

        <div className="flex flex-row gap-3 items-start justify-center h-full overflow-hidden">
          {item?.images?.length ? (
            <Image
              alt="Album cover"
              className="!overflow-hidden w-[25%] min-w-[25%] !max-w-[25%] !aspect-[4/3.5] !rounded-md"
              shadow="sm"
              src={item?.images[0]?.secureUrl}
              width="25%"
              removeWrapper
            />
          ) : null}
          <div className="flex flex-col gap-0 w-full items-start h-full">
            <div className="w-full flex justify-between items-center">
              <div className="flex items-center gap-1 mb-1.5">
                <h1 className="text-sm font-semibold py-1 leading-tight">
                  {item?.name}
                </h1>
                <Favorite
                  item={item}
                  onClick={
                    showDelete
                      ? () => handleSelect(item.id)
                      : handleFavoriteClick
                  }
                  size={16}
                />
              </div>

              {showDelete ? (
                <div className="">
                  {isSelected ? (
                    <IconCircleMinus
                      className="text-white bg-danger rounded-full w-7 h-7"
                      aria-label="Category unselected"
                    />
                  ) : (
                    <IconCircle
                      className="text-bluegray-600 w-7 h-7"
                      aria-label="Category selected"
                    />
                  )}
                </div>
              ) : (
                <DetailsTrigger
                  showDetails={showDetails}
                  setShowDetails={setShowDetails}
                  label=""
                  textColor="text-black"
                  iconSize={22}
                />
              )}
            </div>
            <div
              className="flex gap-1 flex-wrap mb-2"
              onMouseEnter={handleEnter}
              onMouseLeave={handleLeave}
            >
              {item?.categories?.map((category) => {
                return (
                  <CategoryPill key={v4()} category={category} size="xs" />
                );
              })}
            </div>
          </div>
        </div>
        <DetailsSpoiler
          item={item}
          marginTop=""
          showDetails={showDetails}
          showOuterCategories
          showLocation
          handleEnter={handleEnter}
          handleLeave={handleLeave}
        />
        {showDelete ? (
          <div
            className="absolute w-full h-full top-0 left-0"
            onClick={() => handleSelect(item.id)}
          />
        ) : null}
      </Card>
    </>
  );
};

export default ItemCard;
