import Carousel from "react-multi-carousel";
import Tooltip from "./Tooltip";
import { handleFeaturedImage, handleUnfeatureImage } from "../lib/handlers";
import { Star } from "lucide-react";
import "react-multi-carousel/lib/styles.css";
import { v4 } from "uuid";

const ImageCarousel = ({ data, onClick, showNav, mutateKey }) => {
  const isMultiple = data?.images?.length > 1;
  data.images = data?.images?.sort((a, b) => b.featured - a.featured);
  return (
    <div className={showNav ? "" : "relative z-[-1]"}>
      <Carousel
        key={data?.length}
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
        {data?.images?.map((image, index) => {
          return (
            <div key={v4()} className="relative">
              <img
                src={image.secureUrl}
                width="100%"
                height="auto"
                className="rounded-xl"
                onClick={() => onClick(index)}
              />
              {isMultiple ? (
                <Tooltip label="Make featured image" position="top" delay={600}>
                  <button
                    className="absolute top-3 right-3"
                    onClick={
                      image?.featured
                        ? () =>
                            handleUnfeatureImage({
                              data,
                              imageId: image.id,
                              mutateKey,
                            })
                        : () =>
                            handleFeaturedImage({
                              imageId: image.id,
                              mutateKey,
                              data,
                            })
                    }
                  >
                    <Star
                      size={24}
                      fill={
                        image?.featured
                          ? "var(--mantine-color-warning-2)"
                          : "transparent"
                      }
                      stroke={
                        image?.featured
                          ? "var(--mantine-color-warning-2)"
                          : "black"
                      }
                    />
                  </button>
                </Tooltip>
              ) : null}
            </div>
          );
        })}
      </Carousel>
    </div>
  );
};
export default ImageCarousel;
