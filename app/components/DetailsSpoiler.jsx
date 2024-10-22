import { useState } from "react";
import { Space, Spoiler } from "@mantine/core";
import CategoryPill from "./CategoryPill";
import IconPill from "./IconPill";
import { IconChevronRight, IconMapPin, IconBox } from "@tabler/icons-react";
import { cardStyles } from "../lib/styles";
import { v4 } from "uuid";

const DetailsSpoiler = ({
  item,
  showDetails,
  showOuterCategories,
  showInnerCategories,
  showLocation,
}) => {
  const categories = (
    <div className="flex gap-1 flex-wrap mb-2">
      {item?.categories?.map((category) => {
        return <CategoryPill key={v4()} category={category} size="xs" />;
      })}
    </div>
  );

  return (
    <>
      {showOuterCategories && item?.categories?.length ? categories : null}

      <Spoiler
        maxHeight={0}
        expanded={showDetails}
        classNames={{ root: "!mb-0" }}
      >
        <Space h={8} />
        {(item?.categories?.length && showInnerCategories) ||
        item?.description ||
        item?.location?.name ||
        item?.container?.name ||
        item?.purchasedAt ||
        item?.serialNumber ||
        item?.quantity ||
        item?.value ? (
          <>
            {showInnerCategories ? categories : null}
            <div className={cardStyles.detailClasses}>
              {showLocation ? (
                <div className="flex flex-wrap gap-x-[2px] gap-y-[5px] items-center text-sm font-medium mb-2">
                  {item?.location?.name ? (
                    <IconPill
                      icon={<IconMapPin size={16} />}
                      href={`/locations/${item?.location?.id}`}
                      name={item?.location?.name}
                      size="xs"
                    />
                  ) : null}

                  {item?.location?.name && item?.container?.name ? (
                    <IconChevronRight size={16} />
                  ) : null}
                  {item?.container?.name ? (
                    <IconPill
                      icon={<IconBox size={16} />}
                      href={`/containers/${item?.container?.id}`}
                      name={item?.container?.name}
                      size="xs"
                    />
                  ) : null}
                </div>
              ) : null}
              {item?.description ? (
                <p className="flex gap-2">
                  <label>Description:</label>

                  {item?.description}
                </p>
              ) : null}

              {item?.purchasedAt ? (
                <p className="flex gap-2">
                  <label>Purchased at:</label>

                  {item?.purchasedAt}
                </p>
              ) : null}

              {item?.serialNumber ? (
                <p className="flex gap-2">
                  <label>Serial number:</label>

                  {item?.serialNumber}
                </p>
              ) : null}

              {item?.quantity ? (
                <p className="flex gap-2">
                  <label>Quantity:</label>

                  {item?.quantity}
                </p>
              ) : null}

              {item?.value ? (
                <p className="flex gap-2">
                  <label>Value:</label>

                  {item?.value}
                </p>
              ) : null}
            </div>
          </>
        ) : null}
        <Space h={8} />
      </Spoiler>
    </>
  );
};

export default DetailsSpoiler;
