const ThumbnailGrid = ({ children, classes }) => {
  return (
    <div className={`@container w-full ${classes}`}>
      <div className="grid gap-2 justify-center grid-cols-3 xl:gap-3 @2xs:grid-cols-4 @xs:grid-cols-5 @md:grid-cols-6 @lg:grid-cols-7 @2xl:grid-cols-8 @3xl:grid-cols-9 @4xl:grid-cols-10 @5xl:grid-cols-12 @7xl:grid-cols-16">
        {children}
      </div>
    </div>
  );
};

export default ThumbnailGrid;
