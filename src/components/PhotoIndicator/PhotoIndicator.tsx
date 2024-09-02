import React from "react";
import "./PhotoIndicator.scss";

interface PhotoIndicatorProps {
  totalPhotos: number;
  currentIndex: number;
}

const PhotoIndicator: React.FC<PhotoIndicatorProps> = ({ totalPhotos, currentIndex }) => {
  return (
    <div className="photo-indicator">
      {Array.from({ length: totalPhotos }).map((_, index) => (
        <div
          key={index}
          className={`indicator-dot ${index === currentIndex ? "active" : ""}`}
        ></div>
      ))}
    </div>
  );
};

export default PhotoIndicator;