import { useContext } from "react";
import Carousel from "react-multi-carousel";
import { Button } from "@mantine/core";
import DeleteSelector from "./DeleteSelector";
import { handleToggleSelect } from "../lib/helpers";
import { handleDeleteImages } from "../lib/handlers";
import DeleteButtons from "./DeleteButtons";
import { LocationContext } from "../layout";
import { DeviceContext } from "../layout";
import "react-multi-carousel/lib/styles.css";

// item = { pageData };
// close = { close };
// mutateKey = { selectedKey };
// imagesToDelete = { imagesToDelete };
// setImagesToDelete = { setImagesToDelete };
// showDeleteImages = { showDeleteImages };
// setShowDeleteImages = { setShowDeleteImages };
// handleImageDeletion = { handleImageDeletion };

const DeleteImages = ({ mutateKey, item }) => {
  const isMultiple = item?.images?.length > 1;
  const { imagesToDelete, setImagesToDelete, setShowDeleteImages } =
    useContext(LocationContext);

  const { close } = useContext(DeviceContext);

  const handleDeleteClick = () => {
    handleDeleteImages({
      imagesToDelete,
      mutateKey,
      item,
      userId: item?.userId,
    });
    close();
  };

  const handleCancel = () => {
    setImagesToDelete([]);
    close();
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 5,
      slidesToSlide: 3, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 3,
      slidesToSlide: 2, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  return (
    <>
      <Carousel
        className="rounded-xl"
        showDots={isMultiple}
        swipeable={isMultiple}
        draggable={isMultiple}
        infinite={isMultiple}
        responsive={responsive}
        itemClass="px-2 opacity-50"
      >
        {item?.images?.map((image) => {
          return (
            <div
              className="rounded relative border-red-700 border-4"
              key={image.secureUrl}
            >
              <img
                src={image.secureUrl}
                width="100%"
                height="auto"
                className={`rounded-xl}`}
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
                  isSelectedForDeletion={imagesToDelete?.includes(image)}
                />
              </div>
            </div>
          );
        })}
      </Carousel>
      <div className="w-full flex gap-2 justify-end">
        <Button variant="outline" color="black" onClick={handleCancel}>
          Cancel
        </Button>
        <Button color="danger.5" onClick={handleDeleteClick}>
          Delete
        </Button>
      </div>
    </>
  );
};
export default DeleteImages;
