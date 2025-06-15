import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";

const ImageCarousel = ({ data, onClick, showNav }) => {
  const isMultiple = data?.length > 1 && showNav;
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
        {data?.map((image, index) => {
          return (
            <img
              key={image.publicId}
              src={image.secureUrl}
              width="100%"
              height="auto"
              className="rounded-xl"
              onClick={() => onClick(index)}
            />
          );
        })}
      </Carousel>
    </div>
  );
};
export default ImageCarousel;
