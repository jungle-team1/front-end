import "../canvas/Canvas.css";
import useColorStore from "./state/useColorStore";
import useModeStore from "./state/useModeStore";
const colorOptions = [
    "red", "orange", "yellow", "green", "blue", "purple", "pink", "brown", "gray",
    "black", "white", "cyan", "magenta", "lime", "teal", "navy", "olive", "maroon"
];

const Pallete = () => {
    const setColor = useColorStore((state) => state.setColor);
    const isErase = useModeStore((state) => state.isErase);

    function changeColor(targetColor) {
        setColor(targetColor);
    }

    return (
        <div className="container">
            {!isErase ? (
                colorOptions.map((colorOption, index) => (
                    <div key={index} className="color-options" style={{ backgroundColor: colorOption }} onClick={() => changeColor(colorOption)}>
                    </div>
                ))
            ) : (colorOptions.map((colorOption, index) => (
                <div key={index} className="color-options" style={{ backgroundColor: colorOption }}>
                </div>
            )))}
        </div>
    );
}
export default Pallete;