import React, { useState, useRef, useEffect } from 'react';
import './App.css';

const App = () => {
  const [image, setImage] = useState(null);
  const [mask, setMask] = useState(null);
  const [brushSize, setBrushSize] = useState(5);
  const [brushColor, setBrushColor] = useState('#FFFFFF');
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current && image) {
      const ctx = canvasRef.current.getContext('2d');
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        ctx.drawImage(img, 0, 0, canvasRef.current.width, canvasRef.current.height);
      };
      img.src = image;
    }
  }, [image]);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleExport = () => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      setMask(canvas.toDataURL('image/png'));
    }
  };

  const draw = (event) => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    ctx.fillStyle = brushColor;
    ctx.beginPath();
    ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
    ctx.fill();
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Image Inpainting - Please Insert an Image </h1>
      </header>
      <div className="upload-section">
        <label>Select an Image </label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </div>

      {image && (
        <div className="brush-controls">
          <label>
            Adjust Brush Size:
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => setBrushSize(parseInt(e.target.value, 10))}
            />
          </label>
          <span>{brushSize}px</span>
          <label>
            Select Brush Color:
            <input
              type="color"
              value={brushColor}
              onChange={(e) => setBrushColor(e.target.value)}
            />
          </label>
        </div>
      )}

      {image && (
        <div
          style={{
            position: 'relative',
            width: '500px',
            height: '500px',
            margin: 'auto',
          }}
        >
          <canvas
            ref={canvasRef}
            id="drawingCanvas"
            width="500"
            height="500"
            onMouseMove={(e) => (e.buttons === 1 ? draw(e) : null)}
            style={{
              backgroundImage: `url(${image})`,
              backgroundSize: 'contain',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              border: '1px solid #ccc',
              cursor: 'crosshair',
            }}
          ></canvas>
        </div>
      )}

      {image && (
        <button className="button" onClick={handleExport}>
          Export Mask
        </button>
      )}

      {mask && (
        <div className="output-container">
          <h3>Mask Image</h3>
          <img src={mask} alt="Mask" />
        </div>
      )}
    </div>
  );
};

export default App;
