import ReactCrop from 'react-image-crop'
import 'react-image-crop/dist/ReactCrop.css'
import React, { useState, useCallback, useRef, useEffect } from 'react';
import Badge from "./img/badge.png";
import image1 from "./img/saveVacImage.png";

function generateDownload(canvas, crop) {
    if (!crop || !canvas) {
      return;
    }
  
    canvas.toBlob(
      (blob) => {
        const previewUrl = window.URL.createObjectURL(blob);
  
        const anchor = document.createElement('a');
        anchor.download = 'cropPreview.png';
        anchor.href = URL.createObjectURL(blob);
        anchor.click();
  
        window.URL.revokeObjectURL(previewUrl);
      },
      'profilePic/png',
      1
    );
  }
  
  export default function ImageUpload() {
    const [upImg, setUpImg] = useState();
    const imgRef = useRef(null);
    const previewCanvasRef = useRef(null);
    const [crop, setCrop] = useState({ unit: '%', width: 30, aspect: 1 / 1});
    const [completedCrop, setCompletedCrop] = useState(null);
  
    const onSelectFile = (e) => {
      if (e.target.files && e.target.files.length > 0) {
        const reader = new FileReader();
        reader.addEventListener('load', () => setUpImg(reader.result));
        reader.readAsDataURL(e.target.files[0]);
      }
    };
  
    const onLoad = useCallback((img) => {
      imgRef.current = img;
    }, []);
  
    useEffect(() => {
      if (!completedCrop || !previewCanvasRef.current || !imgRef.current) {
        return;
      }
  
      const image = imgRef.current;
      const canvas = previewCanvasRef.current;
      const crop = completedCrop;
  
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const ctx = canvas.getContext('2d');
      const pixelRatio = window.devicePixelRatio;
  
      canvas.width = crop.width * pixelRatio;
      canvas.height = crop.height * pixelRatio;
  
      ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      ctx.imageSmoothingQuality = 'high';
  
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
      var badgeObj = new Image();
      badgeObj.src = Badge;
      badgeObj.onload = function() {
        ctx.drawImage(
            badgeObj,
            // x position
            15,
            // y position
            0,
            // image size
            crop.width,
            crop.height
          );
      };
    }, [completedCrop]);
  
    return (
      <div className="App">
        <div class="marquee">
            <div class="marquee-inner-top" aria-hidden="true">
                <span>#shareyourshot</span>
                <span>#shareyourshot</span>
                <span>#shareyourshot</span>
                <span>#shareyourshot</span>
            </div>
        </div>
        <div id="main-content">
            <div id="image-view">
                {/* Image Cropper */}
                {!upImg && <img id="title" src= {image1}/>}
                <ReactCrop
                style={{
                    maxWidth:300,
                    maxHeight:500,
                    width: 'auto',
                    height: 'auto',}}
                src={upImg}
                onImageLoaded={onLoad}
                crop={crop}
                onChange={(c) => setCrop(c)}
                onComplete={(c) => setCompletedCrop(c)}
                circularCrop={true}
                />
                {/* Merged image */}
                <div>
                    <canvas
                        ref={previewCanvasRef}
                        style={{
                        width: Math.round(completedCrop?.width ?? 0),
                        height: Math.round(completedCrop?.height ?? 0)
                        }}
                    />
                </div>
            </div>
            <div class="formBody">
                <form>
                    <div id="formtext">
                        <label for= "flname">Name: </label>
                        <input type="text" id="flname" name="flname"/><br></br>
                        <label for= "date">Date: </label>
                        <input type="date" id="date" name="date"/><br></br>
                        <label for= "provider">Vaccination Provider: </label>
                        <input type="text" id="provider" name="provider"/><br></br>
                        <label for="img">Select image: </label>
                        <input type="file" accept="image/*" onChange={onSelectFile} />
                    </div>
                </form>
            </div>
            {/* download button */}
        <button
          type="button"
          disabled={!completedCrop?.width || !completedCrop?.height}

          onClick={() =>
            generateDownload(previewCanvasRef.current, completedCrop)
          }
        >
          Download image
        </button>
        </div>
        <div class="marquee bottom">
            <div class="marquee-inner-bottom" aria-hidden="true">
                <span>#shareyourshot</span>
                <span>#shareyourshot</span>
                <span>#shareyourshot</span>
                <span>#shareyourshot</span>
            </div>
        </div>
      </div>
    );
  }
