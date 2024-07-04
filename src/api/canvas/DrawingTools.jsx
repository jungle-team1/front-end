import { useRef } from "react";
import useColorStore from "./state/useColorStore";
import useModeStore from "./state/useModeStore";
import "./Canvas.css";

const DrawingTools = () => {
    const isColor = useColorStore((state) => state.isColor);
    const setColor = useColorStore((state) => state.setColor);

    // const isPainting = useModeStore((state) => state.isPainting);
    // const setIsPainting = useModeStore((state) => state.setIsPainting);

    const isRectangle = useModeStore((state) => state.isRectangle);
    const setIsRectangle = useModeStore((state) => state.setIsRectangle);

    const isCircle = useModeStore((state) => state.isCircle);
    const setIsCircle = useModeStore((state) => state.setIsCircle);

    const isErase = useModeStore((state) => state.isErase);
    const setIsErase = useModeStore((state) => state.setIsErase);

    const pencilBtnRef = useRef(null);
    const eraseBtnRef = useRef(null);
    const rectBtnRef = useRef(null);
    const fillRectBtnRef = useRef(null);
    const circleBtnRef = useRef(null);
    const fillCircleBtnRef = useRef(null);

    function pencilMode() {
        setColor("black");
        setIsRectangle(false);
        setIsCircle(false);
        setIsErase(false);
        // setIsPainting(true);
    }

    function eraserMode() {
        // setIsPainting(false);
        setIsRectangle(false);
        setIsCircle(false);
        setIsErase(true);
    }

    const rectangleMode = () => {
        setColor("black");
        // setIsPainting(false);
        setIsRectangle(true);
        setIsCircle(false);
        setIsErase(false);
    }

    function circleMode() {
        setColor("black");
        // setIsPainting(false);
        setIsRectangle(false);
        setIsCircle(true);
        setIsErase(false);
    }

    function btnReset() {
        [pencilBtnRef, eraseBtnRef, rectBtnRef, fillRectBtnRef, circleBtnRef, fillCircleBtnRef].forEach(ref => {
            if (ref.current) {
                ref.current.style.border = "1px solid black";
                ref.current.style.backgroundColor = "white";
            }
        });
    }

    function btnSet(buttonRef) {
        if (buttonRef.current) {
            buttonRef.current.style.border = "10px solid red";
            buttonRef.current.style.backgroundColor = "wheat";
        }
    }
    // 연필 모드
    function changePencilMode() {
        btnReset(pencilBtnRef);
        pencilMode();
        btnSet(pencilBtnRef);
    }

    function changeEraserMode() {
        btnReset();
        eraserMode();
        setColor("white");
        btnSet(eraseBtnRef);
    }

    // 빈 사각형 모드
    function changeRectangleMode() {
        btnReset();
        rectangleMode();
        console.log(isRectangle);
        btnSet(rectBtnRef);
    }

    // 색칠된 사각형 모드
    function changeFillRectangleMode() {
        btnReset();
        rectangleMode();
        btnSet(fillRectBtnRef);
    }

    // 빈 원형 모드
    function changeCircleMode() {
        btnReset();
        circleMode();
        btnSet(circleBtnRef);
    }

    // 색칠된 원형 모드
    function changeFillCircleMode() {
        btnReset();
        circleMode();
        btnSet(fillCircleBtnRef);
    }

    return (
        <div>
            <div className="container">
                <button className="pencil-btn" ref={pencilBtnRef} onClick={changePencilMode}></button>
                <button className="erase-btn" ref={eraseBtnRef} onClick={changeEraserMode}></button>
            </div>
            <div className="container">
                <button className="strokeRect-btn" ref={rectBtnRef} onClick={changeRectangleMode}></button>
                <button className="fillRect-btn" ref={fillRectBtnRef} onClick={changeFillRectangleMode}></button>
            </div>
            <div className="container">
                <button className="strokeCircle-btn" ref={circleBtnRef} onClick={changeCircleMode}></button>
                <button className="fillCircle-btn" ref={fillCircleBtnRef} onClick={changeFillCircleMode}></button>
            </div>
        </div>
    )
}
export default DrawingTools;
