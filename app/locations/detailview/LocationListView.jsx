import { GridLayout } from "@/app/components";
import LocationCard from "./LocationCard";
const LocationListView = ({ locations }) => (
  <GridLayout classes="pb-32 lg:pb-4">
    {locations.map((location) => (
      <LocationCard key={`location${location.name}`} location={location} />
    ))}
  </GridLayout>
);

export default LocationListView;
