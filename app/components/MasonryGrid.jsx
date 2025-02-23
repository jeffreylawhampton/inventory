import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const MasonryGrid = ({ children }) => {
  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{
        300: 1,
        490: 2,
        650: 3,
        860: 4,
        1100: 5,
        1300: 6,
        1900: 7,
      }}
    >
      <Masonry className={`grid-flow-col-dense grow pb-12`} gutter={8}>
        {children}
      </Masonry>
    </ResponsiveMasonry>
  );
};

export default MasonryGrid;
