import LocationCard from "./LocationCard";
const LocationListView = ({ locations }) => (
  <>
    {locations.map((location) => (
      <LocationCard key={`location${location.name}`} location={location} />
    ))}
  </>
);

export default LocationListView;
