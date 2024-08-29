import { Accordion, AccordionItem, Card } from "@nextui-org/react";
import Droppable from "./Droppable";
import { GripHorizontal } from "lucide-react";
import Draggable from "./Draggable";
import ItemCard from "./Card";

const Container = ({ container, activeItem }) => {
  const children = container?.items?.concat(container?.containers);

  return (
    <Draggable id={container.id} item={container}>
      <Card
        isPressable={false}
        classNames={{
          base: `p-0 ${activeItem?.name === container.name ? "hidden" : ""}`,
        }}
      >
        <GripHorizontal />
        <Droppable
          key={container.name}
          id={container.name}
          className="min-h-20 w-full flex flex-col gap-0 pt-3"
          item={container}
        >
          <Accordion>
            <AccordionItem title={container.name}>
              {children?.map((child) => {
                const isContainer = child.hasOwnProperty("parentContainerId");
                return isContainer ? (
                  <Container
                    container={child}
                    key={container.name}
                    isContainer={isContainer}
                    activeItem={activeItem}
                  />
                ) : (
                  <Draggable
                    key={container.name}
                    id={container.name}
                    item={child}
                  >
                    <ItemCard item={child} activeItem={activeItem} />
                  </Draggable>
                );
              })}
              {/* </Droppable> */}
            </AccordionItem>
          </Accordion>
        </Droppable>
      </Card>
    </Draggable>
  );
};
export default Container;
