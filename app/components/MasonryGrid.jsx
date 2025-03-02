import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const MasonryGrid = ({ children, gutter = 10 }) => {
  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{
        300: 1,
        390: 2,
        600: 3,
        860: 4,
        1100: 5,
        1300: 6,
        1900: 7,
      }}
    >
      <Masonry className={`grid-flow-col-dense grow pb-12`} gutter={gutter}>
        {children}
      </Masonry>
    </ResponsiveMasonry>
  );
};

export default MasonryGrid;
