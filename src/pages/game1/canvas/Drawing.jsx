import './Drawing.css'
import {useEffect, useRef, useState} from 'react';
import {Clear, Ellipse, ERASE, Pencil, Rectangle, TOOL_CLEAR, TOOL_ELLIPSE, TOOL_PENCIL, TOOL_RECTANGLE} from './tools';
import {
    calControlPoints,
    calDrawingData,
    drainPoints, drawDrawingBezierData, setColor,
    setDelay, setMaxWidth, setMinWidth,
    setOpacity,
    setRoundCap,
    transformPointToBezier
} from "laser-pen";
import {useCanvasStore} from '../../../store/canvas/useCanvasStore';
import useSocketStore from "../../../store/socket/useSocketStore.js";
import useCatchLiarStore from "../../../store/game/useCatchLiarStore.js";
import useRoomStore from "../../../store/room/useRoomStore.js";
import Laser, {TOOL_LASER} from "./tools/Laser.js";
import {useLaserStore} from "../../../store/canvas/useLaserStore.js";


const toolsMap = {
    [TOOL_PENCIL]: Pencil,
    [TOOL_CLEAR]: Clear,
    [TOOL_RECTANGLE]: Rectangle,
    [TOOL_ELLIPSE]: Ellipse,
    [ERASE]: Pencil,
    [TOOL_LASER]: Laser
};

const Drawing = ({width, height}) => {
    const [lasers, setLasers] = useState([]);
    const [lastLineCompleteTime, setLastLineCompleteTime] = useState(null);
    const [isClick, setIsClick] = useState(false);

    const canvasRef = useRef(null);
    const ctxRef = useRef(null);
    const toolRef = useRef(null); 
    // let isClick = false;

    const { socket } = useSocketStore();
    const { tool, color, size, fillColor, setCanvas, setTool } = useCanvasStore();
    // const { lasers, lastLineCompleteTime, setLasers, setLastLineCompleteTime } = useLaserStore();
    const { roomId } = useRoomStore();
    const { isDrawing } = useCatchLiarStore();

    useEffect(() => {
        const canvas = canvasRef.current;
        setCanvas(canvas);
        ctxRef.current = canvas.getContext('2d');

        // // 레이저 펜 초기 설정
        setDelay(3000);
        setRoundCap(true);
    }, []);

    useEffect(() => {
        initTool(tool);
        if(tool === ERASE) {
            ctxRef.current.strokeStyle = color;
        }

        if(tool === TOOL_CLEAR) {
            toolRef.current.clearCanvas(width, height);
            setTool(TOOL_PENCIL);
        }
    }, [tool]);

    useEffect(() => {
        socket?.on('drawer_draw_start', handleDrawerDrawStart);
        socket?.on('drawer_draw_move', handleDrawerDrawMove);
        socket?.on('watcher_draw_start', handleWatcherDrawStart);
        socket?.on('watcher_draw_move', handleWatcherDrawMove);

        return () => {
            socket?.off("drawer_draw_start", handleDrawerDrawStart);
            socket?.off("drawer_draw_move", handleDrawerDrawMove);
            socket?.off('watcher_draw_start', handleWatcherDrawStart);
            socket?.off('watcher_draw_move', handleWatcherDrawMove);
        };
    }, [socket]);

    useEffect(() => {
        if (lasers.length === 0) return;

        const intervalId = setInterval(laser_draw);
        return () => {
            clearInterval(intervalId);
        };
    }, [lasers, lastLineCompleteTime]);


    const initTool = (tool) => {
        toolRef.current = toolsMap[tool](ctxRef.current);
    }

    const getCursorPosition = (e) => {
        const {top, left} = canvasRef.current.getBoundingClientRect();
        return {
            x: e.clientX - left,
            y: e.clientY - top
        }
    }

    // 인자가 필요 없을 경우?
    const onMouseDown = (e) => {
        // isClick = true;
        setIsClick(true);
        console.log('onMouseDown : ',isClick);
        const {x, y} = getCursorPosition(e);

        if(isDrawing) {
            if(tool === TOOL_PENCIL){
                toolRef.current.onMouseDown(x, y, color, size);
            } else if (tool === ERASE) {
                toolRef.current.onMouseDown(x, y, 'white', size);
            } else {
                toolRef.current.onMouseDown(x, y, color, size, fillColor);
            }

            socket?.emit('drawer_draw_start', { tool, xAxis: x, yAxis: y, color, size, fillColor, roomId });
        } else {
            laserOnMouseDown(x, y);
            socket?.emit('watcher_draw_start', { tool, xAxis: x, yAxis: y, color, size, fillColor, roomId });
        }
    }

    const onMouseUp = (e) => {
        // isClick = false;
        setIsClick(false);
        const {x, y} = getCursorPosition(e);
        if (isDrawing) {
            toolRef.current.onMouseUp(x, y);
        } else {
            laserOnMouseUp(x, y);
        }
    }

    const onMouseMove = (e) => {
        if (!isClick) return;
        const {x, y} = getCursorPosition(e);

        if(isDrawing) {
            toolRef.current.onMouseMove(x, y);
            socket?.emit('drawer_draw_move', { tool, xAxis: x, yAxis: y, color, size, fillColor, roomId });
        } else {
            laserOnMouseMove(x, y);
            socket?.emit('watcher_draw_move', { tool, xAxis: x, yAxis: y, color, size, fillColor, roomId });
        }
    }

    const laserOnMouseDown = (x, y) => {
        const newPoint = {
            x, y, time: Date.now(),
        };
        setLasers([...lasers, [newPoint]]); // 새로운 선 시작
    }

    const laserOnMouseMove = (x, y) => {
        const newPoint = {
            x, y, time: Date.now(),
        };

        setLasers((prevLines) => {
            if (prevLines.length === 0) {
                // lines 배열이 비어 있는 경우
                return [[newPoint]]; // 새로운 선 시작
            } else {
                const lastLine = prevLines[prevLines.length - 1];
                return [...prevLines.slice(0, -1), [...lastLine, newPoint]]; // 마지막 선에 포인트 추가
            }
        });
        setLastLineCompleteTime(Date.now()); // 마지막 선 완료 시간 기록
    }

    const laserOnMouseUp = (x, y) => {
        if (lasers.length > 0) {
            // lines 배열이 비어있지 않은 경우에만
            setLastLineCompleteTime(Date.now()); // 마지막 선 완료 시간 기록
        }
    }

    const laser_draw = () => {
        if (!ctxRef.current) return;
        // ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        lasers.forEach((laser) => {
            const drainedPoints = drainPoints(laser);

            const controlPoints = calControlPoints(drainedPoints);
            const bezierCurves = transformPointToBezier(drainedPoints, controlPoints);
            const totalLength = bezierCurves.reduce((sum, bz) => sum + bz.length(), 0);
            const drawingData = calDrawingData(bezierCurves, totalLength);

            setColor(255, 255, 255);
            setMaxWidth(10);  // 하이라이트는 조금 더 두껍게
            setMinWidth(10);
            ctxRef.current.globalAlpha = 1;
            drawDrawingBezierData(ctxRef.current, drawingData);
        });

        const currentTime = Date.now();
        lasers.forEach((laser) => {
            const drainedPoints = drainPoints(laser);
            if (drainedPoints.length > 2) {
                const elapsedTime = currentTime - laser[0].time;
                const opacity = Math.max(0, 1 - elapsedTime / 5000);
                setOpacity(opacity);

                const controlPoints = calControlPoints(drainedPoints);
                const bezierCurves = transformPointToBezier(drainedPoints, controlPoints);
                const totalLength = bezierCurves.reduce((sum, bz) => sum + bz.length(), 0);
                const drawingData = calDrawingData(bezierCurves, totalLength);

                // 하이라이트 (흰색) 그리기
                setColor(255, 0, 0);
                setMaxWidth(10);  // 하이라이트는 조금 더 두껍게
                setMinWidth(10);
                ctxRef.current.globalAlpha = 0.3;
                drawDrawingBezierData(ctxRef.current, drawingData);
            }
        });

        if (lastLineCompleteTime && Date.now() - lastLineCompleteTime > 3000) {
            setLasers([]); // 3초 후 모든 선 지우기
        }
    }


    const handleDrawerDrawStart = (data) => {
        const {tool, xAxis, yAxis, color, size, fillColor} = data;

        if(tool === TOOL_PENCIL){
            toolRef.current.onMouseDown(xAxis, yAxis, color, size);
        } else if (tool === ERASE) {
            toolRef.current.onMouseDown(xAxis, yAxis, 'white', size);
        } else {
            toolRef.current.onMouseDown(xAxis, yAxis, color, size, fillColor);
        }
    }

    const handleDrawerDrawMove = (data) => {
        const {tool, xAxis, yAxis, color, size, fillColor} = data;
        toolRef.current.onMouseMove(xAxis, yAxis);
    }

    const handleWatcherDrawStart = (data) => {
        if(isDrawing) return;

        const {tool, xAxis, yAxis, color, size, fillColor} = data;
        toolRef.current.onMouseDown(xAxis, yAxis);
    }

    const handleWatcherDrawMove = (data) => {
        if(isDrawing) return;

        const {tool, xAxis, yAxis, color, size, fillColor} = data;
        toolRef.current.onMouseMove(xAxis, yAxis);
    }

    return (
        <>
            <canvas
                width={width}
                height={height}
                ref={canvasRef}
                onMouseDown={onMouseDown}
                onMouseUp={onMouseUp}
                onMouseMove={onMouseMove}
                style={{ backgroundColor: 'transparent' }}
            />
        </>
    );
}

export default Drawing;