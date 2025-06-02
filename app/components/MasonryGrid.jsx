import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const MasonryGrid = ({
  children,
  tablet = 3,
  desktop = 4,
  xl = 5,
  xxl = 7,
  gutter = 10,
}) => {
  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{
        300: 1,
        390: 2,
        600: 3,
        860: tablet,
        1200: desktop,
        1600: xl,
        1900: xxl,
      }}
    >
      <Masonry className={`grid-flow-col-dense grow pb-12`} gutter={gutter}>
        {children}
      </Masonry>
    </ResponsiveMasonry>
  );
};

export default MasonryGrid;
