import React, { useRef, useState, useCallback } from 'react';

interface ImageUploaderProps {
  onImageUpload: (files: FileList) => void;
  disabled: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      onImageUpload(files);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragEvents = useCallback((e: React.DragEvent<HTMLLabelElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(dragging);
    }
  }, [disabled]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    handleDragEvents(e, false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onImageUpload(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  }, [handleDragEvents, onImageUpload]);

  const dragClasses = isDragging ? 'border-yellow-400 bg-[#3b385e]/50' : 'border-gray-500 hover:border-yellow-300';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
        disabled={disabled}
        multiple
      />
      <label
        className={`flex flex-col items-center justify-center w-full h-48 border-2 ${dragClasses} border-dashed rounded-lg transition-colors duration-300 ${disabledClasses}`}
        onDragEnter={(e) => handleDragEvents(e, true)}
        onDragLeave={(e) => handleDragEvents(e, false)}
        onDragOver={(e) => handleDragEvents(e, true)}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg className="w-8 h-8 mb-4 text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
          </svg>
          <p className="mb-2 text-sm text-gray-400">
            <span className="font-semibold">Cliquez pour téléverser</span> ou glissez-déposez
          </p>
          <p className="text-xs text-gray-500">PNG, JPG or WEBP</p>
        </div>
      </label>
    </div>
  );
};

export default ImageUploader;