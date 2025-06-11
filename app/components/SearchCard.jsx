"use client";
import { useRouter } from "next/navigation";
import { Card } from "@mantine/core";
import CountPills from "./CountPills";
import IconPill from "./IconPill";
import { getTextColor } from "../lib/helpers";
import { IconBox, IconMapPin } from "@tabler/icons-react";
import { breadcrumbStyles } from "../lib/styles";

const SearchCard = ({ item, handleFavoriteClick, type, setShowSearch }) => {
  const router = useRouter();

  const onClick = () => {
    if (type === "categories") {
      router.push(`/categories/${item.id}`);
    } else {
      router.push(`/locations?type=${type.slice(0, -1)}&id=${item.id}`);
    }
    setShowSearch(false);
  };

  return (
    <Card
      classNames={{ root: "@container hover:brightness-90 !p-3 !rounded-md" }}
      onClick={onClick}
      styles={{
        root: {
          backgroundColor: item?.color?.hex || "#ececec",
          color:
            type === "locations" || type === "items"
              ? "black"
              : getTextColor(item?.color?.hex) || "black",
        },
      }}
    >
      <div className="flex flex-col @xs:flex-row gap-x-0 gap-y-3 w-full @xs:justify-between @xs:items-center h-full">
        <h1 className="!text-[15px] pl-1 pr-2  font-semibold leading-tight hyphens-auto text-pretty !break-words w-full @xs:w-1/2">
          {item?.name}
        </h1>
        <div className="flex gap-1 items-center">
          <CountPills
            containerCount={item?._count?.containers}
            itemCount={item?._count?.items}
            textClasses={"text-sm font-medium"}
            verticalMargin="my-0 !pl-0"
            transparent
            showContainers={item?._count?.hasOwnProperty("containers")}
            showFavorite={item?.hasOwnProperty("favorite")}
            showItems={item?._count?.hasOwnProperty("items")}
            showEmpty={false}
            item={item}
            handleFavoriteClick={handleFavoriteClick}
            type={type}
            red={type === "items"}
          />
          {item?.location ? (
            <IconPill
              icon={
                <IconMapPin
                  aria-label="Location"
                  size={breadcrumbStyles.iconSize}
                />
              }
              name={item?.location?.name}
              labelClasses={breadcrumbStyles.textSize}
              padding={breadcrumbStyles.padding}
            />
          ) : null}

          {item?.container ? (
            <IconPill
              icon={
                <IconBox
                  aria-label="Container"
                  size={breadcrumbStyles.iconSize}
                />
              }
              name={item?.container?.name}
              labelClasses={breadcrumbStyles.textSize}
              padding={breadcrumbStyles.padding}
            />
          ) : null}
        </div>
      </div>
    </Card>
  );
};

export default SearchCard;
