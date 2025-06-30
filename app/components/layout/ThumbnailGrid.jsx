const ThumbnailGrid = ({ children, classes }) => {
  return (
    <div className={`@container w-full ${classes}`}>
      <div className="grid gap-3 justify-center grid-cols-2 @2xs:grid-cols-4  @md:grid-cols-5 @xl:grid-cols-6 @2xl:grid-cols-6 @3xl:grid-cols-8 @4xl:grid-cols-10 @5xl:grid-cols-10 @6xl:grid-cols-12">
        {children}
      </div>
    </div>
  );
};

export default ThumbnailGrid;
