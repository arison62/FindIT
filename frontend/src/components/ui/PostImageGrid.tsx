import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";

const PostImageGrid = ({ images = [] }:{
    images?: { image_url: string }[]
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // If no images, return null or a placeholder
  if (!images || images.length === 0) {
    return (
      <div className="bg-gray-100 rounded-md flex items-center justify-center h-40">
        <span className="text-gray-500">Aucune image disponible</span>
      </div>
    );
  }

  // Handle image click to open modal
  const handleImageClick = (image) => {
    setSelectedImage(image);
    setIsModalOpen(true);
  };

  // Create grid layout based on image count
  const getGridClass = () => {
    switch (images.length) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
        return "grid-cols-3";
      case 4:
        return "grid-cols-2 md:grid-cols-4";
      default:
        return "grid-cols-2 md:grid-cols-3";
    }
  };

  // Function to handle navigation between images in modal
  const navigateImages = (direction) => {
    const currentIndex = images.findIndex(
      (img) => img.image_url === selectedImage.image_url
    );
    let newIndex;
    
    if (direction === "next") {
      newIndex = (currentIndex + 1) % images.length;
    } else {
      newIndex = (currentIndex - 1 + images.length) % images.length;
    }
    
    setSelectedImage(images[newIndex]);
  };

  return (
    <>
      {/* Image Grid */}
      <div className={`grid ${getGridClass()} gap-2 w-full`}>
        {images.slice(0, 5).map((image, index) => (
          <div
            key={index}
            className={`relative rounded-md overflow-hidden ${
              index === 4 && images.length > 5 ? "relative" : ""
            }`}
            onClick={() => handleImageClick(image)}
          >
            <img
              src={image.image_url}
              alt={`Image ${index + 1}`}
              className="w-full h-40 object-cover cursor-pointer hover:opacity-90 transition-opacity"
            />
            
            {/* Show overlay with count for images > 5 */}
            {index === 4 && images.length > 5 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center cursor-pointer">
                <span className="text-white text-lg font-medium">+{images.length - 5}</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal for expanded image view */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-3xl p-0 overflow-hidden bg-black">
          <div className="flex flex-col relative">
            {/* Large image */}
            <div className="flex items-center justify-center h-96 md:h-[550px]">
              {selectedImage && (
                <img
                  src={selectedImage.image_url}
                  alt="Image agrandie"
                  className="max-h-full max-w-full object-contain"
                />
              )}
            </div>
            
            {/* Navigation controls */}
            <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-4">
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-black bg-opacity-40 text-white border-none h-10 w-10"
                onClick={() => navigateImages("prev")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full bg-black bg-opacity-40 text-white border-none h-10 w-10"
                onClick={() => navigateImages("next")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Button>
            </div>
            
            {/* Close button */}
            <DialogClose className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black bg-opacity-40 p-0 text-white hover:bg-opacity-60">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mx-auto"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </DialogClose>
            
            {/* Image counter */}
            <div className="absolute bottom-4 left-0 right-0 text-center text-white">
              {selectedImage && (
                <span>
                  {images.findIndex(
                    (img) => img.image_url === selectedImage.image_url
                  ) + 1} / {images.length}
                </span>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PostImageGrid;