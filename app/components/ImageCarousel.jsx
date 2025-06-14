import { useContext } from "react";
import Carousel from "react-multi-carousel";
import DeleteSelector from "./DeleteSelector";
import { LocationContext } from "../locations/layout";
import { handleToggleSelect } from "../lib/helpers";
import { handleDeleteImages } from "../lib/handlers";
import "react-multi-carousel/lib/styles.css";
import DeleteButtons from "./DeleteButtons";

const ImageCarousel = ({ data, onClick, mutateKey, item }) => {
  const isMultiple = data?.length > 1;
  const {
    showDeleteImages,
    setShowDeleteImages,
    imagesToDelete,
    setImagesToDelete,
    handleImageDeletion,
  } = useContext(LocationContext);

  const onDeleteClick = (image) => {
    return handleToggleSelect(image, imagesToDelete, setImagesToDelete);
  };

  const handleCancel = () => {
    setImagesToDelete([]);
    setShowDeleteImages(false);
  };

  return (
    <>
      {data?.length ? (
        <button onClick={handleImageDeletion}>Edit images</button>
      ) : null}

      <Carousel
        className="rounded-xl"
        showDots={isMultiple}
        swipeable={isMultiple}
        draggable={isMultiple}
        infinite={isMultiple}
        responsive={{
          mobile: {
            breakpoint: { max: 10000, min: 0 },
            items: 1,
          },
        }}
      >
        {data?.map((image, index) => {
          return (
            <div className="rounded-xl relative" key={image.secureUrl}>
              <img
                src={image.secureUrl}
                width="100%"
                height="auto"
                className="rounded-xl"
                onClick={() => onClick(index)}
              />
              {showDeleteImages ? (
                <div
                  className="absolute top-2 right-2"
                  onClick={() => onDeleteClick(image)}
                >
                  <DeleteSelector
                    isSelectedForDeletion={imagesToDelete?.includes(image)}
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </Carousel>
    </>
  );
};
export default ImageCarousel;
