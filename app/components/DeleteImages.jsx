import { useContext, useEffect } from "react";
import Carousel from "react-multi-carousel";
import { Button } from "@mantine/core";
import DeleteSelector from "./DeleteSelector";
import { handleToggleSelect } from "../lib/helpers";
import { handleDeleteImages } from "../lib/handlers";
import { DeviceContext } from "../providers";
import "react-multi-carousel/lib/styles.css";

const DeleteImages = ({ mutateKey, item }) => {
  const isMultiple = item?.images?.length > 1;

  const { imagesToDelete, setImagesToDelete, close, setHideCarouselNav } =
    useContext(DeviceContext);

  useEffect(() => {
    setHideCarouselNav(true);
  }, [setHideCarouselNav]);

  const handleDeleteClick = () => {
    handleDeleteImages({
      imagesToDelete,
      mutateKey,
      item,
      userId: item?.userId,
    });
    setImagesToDelete([]);
    setHideCarouselNav(false);
    close();
  };

  const handleCancel = () => {
    setImagesToDelete([]);
    setHideCarouselNav(false);
    close();
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
      slidesToSlide: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
      slidesToSlide: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
      slidesToSlide: 1,
    },
  };

  return (
    <>
      <Carousel
        className="rounded-xl"
        showDots={isMultiple}
        swipeable={isMultiple}
        draggable={isMultiple}
        infinite={false}
        responsive={responsive}
      >
        {item?.images?.map((image) => {
          const isSelected = imagesToDelete?.includes(image);
          return (
            <div
              className={`rounded relative overflow-visible m-2 ${
                isSelected
                  ? "outline outline-[3px] outline-danger-500"
                  : "opacity-40"
              }`}
              key={image.secureUrl}
            >
              <img
                src={image.secureUrl}
                alt=""
                width="100%"
                height="auto"
                onClick={() =>
                  handleToggleSelect(image, imagesToDelete, setImagesToDelete)
                }
              />

              <div
                className="absolute top-2 right-2"
                onClick={() =>
                  handleToggleSelect(image, imagesToDelete, setImagesToDelete)
                }
              >
                <DeleteSelector
                  isSelectedForDeletion={isSelected}
                  iconSize={30}
                />
              </div>
            </div>
          );
        })}
      </Carousel>
      <div className="w-full flex gap-2 justify-end mt-8 mb-2">
        <Button variant="outline" color="black" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          color="danger.3"
          onClick={handleDeleteClick}
          disabled={!imagesToDelete?.length}
          className="!w-[150px]"
        >
          Delete {imagesToDelete?.length} image
          {imagesToDelete?.length != 1 ? "s" : null}
        </Button>
      </div>
    </>
  );
};
export default DeleteImages;
