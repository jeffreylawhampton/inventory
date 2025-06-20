const GridLayout = ({ children }) => {
  return (
    <div className="w-full @container">
      <div className="grid grid-flow-row gap-3 grid-cols-1 @sm:grid-cols-2 @3xl:grid-cols-3 @5xl:grid-cols-4 @6xl:grid-cols-5 @7xl:grid-cols-6">
        {children}
      </div>
    </div>
  );
};

export default GridLayout;
