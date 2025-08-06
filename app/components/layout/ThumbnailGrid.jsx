const ThumbnailGrid = ({ children, classes }) => {
  return (
    <div className={`@container w-full ${classes}`}>
      <div className="grid gap-2 justify-center grid-cols-2 xl:gap-3 @2xs:grid-cols-4 @md:grid-cols-6 @2xl:grid-cols-6 @3xl:grid-cols-8 @4xl:grid-cols-10 @5xl:grid-cols-12 @7xl:grid-cols-16">
        {children}
      </div>
    </div>
  );
};

export default ThumbnailGrid;
