import { Card } from "@nextui-org/react";

const RecursiveContainer = ({ data }) => {
  return (
    <div style={{ paddingLeft: "20px" }}>
      {data.map((parent) => {
        return (
          <Card key={parent.name}>
            <span>{parent.name}</span>
            <div>
              {parent.containers && (
                <RecursiveContainer data={parent.containers} />
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default RecursiveContainer;
