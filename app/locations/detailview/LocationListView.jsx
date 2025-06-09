import { GridLayout } from "@/app/components";
import LocationCard from "./LocationCard";
const LocationListView = ({ locations }) => (
  <GridLayout>
    {locations.map((location) => (
      <LocationCard key={`location${location.name}`} location={location} />
    ))}
  </GridLayout>
);

export default LocationListView;
