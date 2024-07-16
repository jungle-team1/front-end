import {useLaserStore} from "../../../../store/canvas/useLaserStore.js";

export const TOOL_LASER = 'laser';

export default (context) => {
    const { lasers, setLasers, lastLineCompleteTime, setLastLineCompleteTime } = useLaserStore();

    const onMouseDown = (x, y) => {
        const newPoint = {
            x, y, time: Date.now(),
        };
        setLasers([...lasers, [newPoint]]); // 새로운 선 시작
    }

    const onMouseMove = (x, y) => {
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

    const onMouseUp = (x, y) => {
        if (lasers.length > 0) {
            // lines 배열이 비어있지 않은 경우에만
            setLastLineCompleteTime(Date.now()); // 마지막 선 완료 시간 기록
        }
    }


    return {
        onMouseDown,
        onMouseMove,
        onMouseUp
    };
}
