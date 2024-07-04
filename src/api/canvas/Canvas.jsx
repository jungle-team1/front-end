import { useEffect, useRef, useState } from "react";
import Pallete from "./Pallete";
import "./Canvas.css";
import useColorStore from "./state/useColorStore";
import useModeStore from "./state/useModeStore";
import DrawingTools from "./DrawingTools";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;

const Canvas = () => {
  const canvasRef = useRef(null);
  const widthBtnRef = useRef(null);

  const [lineWidth, setLineWidth] = useState(25);

  const color = useColorStore((state) => state.color);
  const setColor = useColorStore((state) => state.setColor);

  let isPainting = false;

  // const isPainting = useModeStore((state) => state.isPainting);
  // const setIsPainting = useModeStore((state) => state.setIsPainting);

  const isRectangle = useModeStore((state) => state.isRectangle);
  const setIsRectangle = useModeStore((state) => state.setIsRectangle);

  const isCircle = useModeStore((state) => state.isCircle);
  const setIsCircle = useModeStore((state) => state.setIsCircle);

  const isErase = useModeStore((state) => state.isErase);
  const setIsErase = useModeStore((state) => state.setIsErase);

  // 선 움직인 거리 계산
  let beginX = 0;
  let beginY = 0;
  let endX = 0;
  let endY = 0;
  let moveX = 0;
  let moveY = 0;
  let abs_moveX = 0;
  let abs_moveY = 0;

  // 컴포넌트가 마운트될 때 실행됨
  useEffect(() => {
    const canvas = canvasRef.current;
    // changePencilMode();
    if (canvas) {
      console.log(canvas);  
      const ctx = canvas.getContext("2d");

      canvas.width = CANVAS_WIDTH;
      canvas.height = CANVAS_HEIGHT;

      const onMouseMove = (event) => {
        if (!isPainting) {
          ctx.moveTo(event.offsetX, event.offsetY);
        } else {
          ctx.lineTo(event.offsetX, event.offsetY);
          ctx.stroke();
          return;
        }
      };

      const onStartPainting = (event) => {
        if (!isRectangle) {
          isPainting = true;
          // setIsPainting(true);
        }
        // console.log("rect_1:", isRectangle);
        // console.log("erase_1:", isErase);

        beginX = event.offsetX;
        beginY = event.offsetY;
      };

      const onStopPainting = (event) => {
        isPainting = false;
        // setIsPainting(false);

        endX = event.offsetX;
        endY = event.offsetY;

        moveX = beginX - endX;
        moveY = beginY - endY;

        abs_moveX = Math.abs(moveX);
        abs_moveY = Math.abs(moveY);

        // console.log("rect_2:", isRectangle);
        // console.log("erase_2:", isErase);

        if (isRectangle) {
          ctx.moveTo(beginX, beginY);
          if (moveX <= 0 && moveY <= 0) {
            // 오른쪽 아래로 드래그
            ctx.lineTo(beginX + abs_moveX, beginY);
            ctx.lineTo(beginX + abs_moveX, beginY + abs_moveY);
            ctx.lineTo(beginX, beginY + abs_moveY);
            ctx.lineTo(beginX, beginY);
          } else if (moveX >= 0 && moveY >= 0) {
            // 왼쪽 위로 드래그
            ctx.lineTo(beginX - abs_moveX, beginY);
            ctx.lineTo(beginX - abs_moveX, beginY - abs_moveY);
            ctx.lineTo(beginX, beginY - abs_moveY);
            ctx.lineTo(beginX, beginY);
          } else if (moveX >= 0 && moveY <= 0) {
            // 왼쪽 아래 드래그
            ctx.lineTo(beginX - abs_moveX, beginY);
            ctx.lineTo(beginX - abs_moveX, beginY + abs_moveY);
            ctx.lineTo(beginX, beginY + abs_moveY);
            ctx.lineTo(beginX, beginY);
          } else {
            // 오른쪽 위 드래그
            ctx.lineTo(beginX + abs_moveX, beginY);
            ctx.lineTo(beginX + abs_moveX, beginY - abs_moveY);
            ctx.lineTo(beginX, beginY - abs_moveY);
            ctx.lineTo(beginX, beginY);
          }
        }
        ctx.stroke();
        ctx.beginPath();
      };

      // 마우스 커서 좌표 추적
      canvas.addEventListener("mousemove", onMouseMove);

      // 마우스 눌러서 그리기
      canvas.addEventListener("mousedown", onStartPainting);

      // 마우스 떼거나, 범위 벗어나면 그만 그리기
      canvas.addEventListener("mouseleave", onStopPainting);
      canvas.addEventListener("mouseup", onStopPainting);
    }
  }, []);

  // 라인 두께 및 색상 조절
  useEffect(() => {
    const canvas = canvasRef.current;

    if (widthBtnRef.current) {
      widthBtnRef.current.value = lineWidth;
    }

    if (canvas) {
      const ctx = canvas.getContext("2d");
      ctx.lineWidth = lineWidth;
      ctx.strokeStyle = color;
      ctx.fillStyle = color;
    }
  }, [lineWidth, color]);

  function changeLineWidth(event) {
    setLineWidth(event.target.value);
  }

  return (
    <div className="container">
      <div>
        <div>
          <canvas ref={canvasRef}></canvas>
        </div>
        <div>
          <div className="PB-range-slider-div">
            <input
              type="range"
              min="0"
              max="50"
              step="1"
              className="PB-range-slider"
              onChange={changeLineWidth}
              ref={widthBtnRef}
            ></input>
          </div>
          <Pallete />
          <DrawingTools />
        </div>
      </div>
    </div>
  );
};
export default Canvas;
