import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const MasonryContainer = ({ children, desktopColumns, gutter = 15 }) => {
  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{
        350: 1,
        600: 2,
        1000: 3,
        1400: desktopColumns,
        1900: 5,
      }}
    >
      <Masonry gutter={gutter}>{children}</Masonry>
    </ResponsiveMasonry>
  );
};

export default MasonryContainer;
