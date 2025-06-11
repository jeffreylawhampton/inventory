import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const ImageCarousel = ({ data, onClick }) => {
  const isMultiple = data?.length > 1;
  return (
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
          <div className="rounded-xl" key={image.secureUrl}>
            <img
              src={image.secureUrl}
              width="100%"
              height="auto"
              className="rounded-xl"
              onClick={() => onClick(index)}
            />
          </div>
        );
      })}
    </Carousel>
  );
};
export default ImageCarousel;
