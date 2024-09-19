import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const MasonryContainer = ({ children, desktopColumns, gutter = 15 }) => {
  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{
        350: 1,
        600: 2,
        1000: 3,
        1600: desktopColumns,
      }}
    >
      <Masonry className="grid-flow-col-dense grow pb-32" gutter={gutter}>
        {children}
      </Masonry>
    </ResponsiveMasonry>
  );
};

export default MasonryContainer;
