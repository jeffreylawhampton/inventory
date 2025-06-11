import { useState } from "react";
import LightboxImage from "./LightboxImage";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import "yet-another-react-lightbox/styles.css";

const LightBox = ({ open, setOpen, images, index }) => {
  const [maxZoomPixelRatio, setMaxZoomPixelRatio] = useState(2);
  const slides = images?.map((image) => {
    return { src: image.secureUrl, width: image.width, height: "auto" };
  });
  return (
    <Lightbox
      open={open}
      close={() => setOpen(false)}
      slides={slides}
      index={index}
      render={{ slide: LightboxImage }}
      plugins={[Zoom]}
      zoom={{ maxZoomPixelRatio }}
    />
  );
};

export default LightBox;
