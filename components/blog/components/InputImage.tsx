"use client";
import React, { useState, useRef, useEffect } from "react";
import { FaFileUpload } from "react-icons/fa";
import Image from "next/image";
import { Button } from "@heroui/button";
import { CircularProgress } from "@heroui/react";
const InputImage = ({ value, onChange }: any) => {
  const [image, setImage] = useState(value);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setImage(value);
  }, [value]);

  const onFilesSelected = async ({ target }: any) => {
    if (!target.files) {
      return;
    }
    setUploading(true);
    try {
      let imagesUrl: any[] = [];

      for (const file of target.files) {
        const formData = new FormData();

        formData.append("file", file);
        const response = await fetch("/api/image", {
          body: formData,

          method: "post",
        });
        const { secure_url } = await response.json();

        imagesUrl.push(secure_url);
      }

      onChange(imagesUrl[0]);
      setImage(imagesUrl[0]);
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
      target.value = null;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Button className="w-full" onClick={() => fileInputRef.current?.click()}>
        {uploading ? (
          <CircularProgress size="sm" />
        ) : (
          <>
            <FaFileUpload />
            <span>Subir imagen</span>
          </>
        )}
      </Button>
      {image && (
        <div className="relative top-0 left-0 w-full h-[200px] rounded-md overflow-hidden">
          <Image
            fill
            alt="image"
            className="object-contain w-full h-full"
            src={image}
          />
        </div>
      )}
      <input
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        type="file"
        onChange={onFilesSelected}
      />
    </div>
  );
};

export default InputImage;
