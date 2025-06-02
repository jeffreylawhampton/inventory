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
  handleEnter,
  handleLeave,
}) => {
  const categories = (
    <div
      className="flex gap-1 flex-wrap mb-2"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
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
        classNames={{ root: "!mb-0 text-xs" }}
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
              {(showLocation && item?.location?.name) ||
              (showLocation && item?.container?.name) ? (
                <div
                  className={`flex flex-wrap gap-x-[2px] gap-y-[5px] items-center font-medium mb-2`}
                >
                  {item?.location?.name ? (
                    <IconPill
                      icon={<IconMapPin size={16} />}
                      href={`/locations/${item?.location?.id}`}
                      name={item?.location?.name}
                      size="xs"
                      handleEnter={handleEnter}
                      handleLeave={handleLeave}
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
                      handleEnter={handleEnter}
                      handleLeave={handleLeave}
                    />
                  ) : null}
                </div>
              ) : null}
              {item?.description ? (
                <p>
                  <label>Description:</label>

                  {item?.description}
                </p>
              ) : null}

              {item?.purchasedAt ? (
                <p>
                  <label>Purchased at:</label>

                  {item?.purchasedAt}
                </p>
              ) : null}

              {item?.serialNumber ? (
                <p>
                  <label>Serial number:</label>

                  {item?.serialNumber}
                </p>
              ) : null}

              {item?.quantity ? (
                <p>
                  <label>Quantity:</label>

                  {item?.quantity}
                </p>
              ) : null}

              {item?.value ? (
                <p>
                  <label>Value:</label>${item?.value}
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
