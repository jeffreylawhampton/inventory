export const Columns = ({ children, desktopColumns = 3, gap = 15 }) => {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${desktopColumns}, 1fr)`,
        gap,
        alignItems: "start",
      }}
    >
      {children}
    </div>
  );
};
