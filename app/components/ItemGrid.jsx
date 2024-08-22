const ItemGrid = ({ children, classNames, gap = 6, desktop = 4 }) => {
  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-${desktop} 2xl:grid-cols-4 gap-${gap} ${classNames}`}
    >
      {children}
    </div>
  );
};

export default ItemGrid;
