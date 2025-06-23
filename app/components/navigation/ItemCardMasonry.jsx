import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";

const ItemCardMasonry = ({ children, gutter = 15, pb = "pb-32" }) => {
  return (
    <ResponsiveMasonry
      columnsCountBreakPoints={{
        350: 1,
        450: 2,
        800: 3,
        1000: 4,
        1500: 5,
        1800: 6,
      }}
    >
      <Masonry className={`grid-flow-col-dense grow ${pb}`} gutter={gutter}>
        {children}
      </Masonry>
    </ResponsiveMasonry>
  );
};

export default ItemCardMasonry;
