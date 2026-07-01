import {
    useCallback,
    useEffect,
    useState,
    useRef
} from 'react'

import './multiRangeSlider.css'

const MultiRangeSlider = ({
    min,
    max,
    initialMin,
    initialMax,
    trackColor = "#cecece",
    onChange,
    rangeColor = "#ff0303",
    width = "300px",
} : {
  min: number,
  max: number,
  initialMin?: number,
  initialMax?: number,
  trackColor: string,
  onChange: ({min, max} : { min: number, max: number }) => void,
  rangeColor: string,
  width: string,
}) => {

    const [minVal, setMinVal] = useState(initialMin ?? min);
    const [maxVal, setMaxVal] = useState(initialMax ?? max);
    const minValRef = useRef(initialMin ?? min);
    const maxValRef = useRef(initialMax ?? max);
    const range = useRef<HTMLDivElement>(null);


    // convert to percentage
    const getPercent = useCallback(
        (value: number) => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    );

    // set width of the range to decrease from the left side
    useEffect(() => {
        const minPercent = getPercent(minVal);
        const maxPercent = getPercent(maxValRef.current);

        if (range.current) {
            range.current.style.left = `${minPercent}%`;
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [minVal, getPercent]);

    // set the width of the range to decrease from right side
    useEffect(() => {
        const minPercent = getPercent(minValRef.current);
        const maxPercent = getPercent(maxVal);

        if (range.current) {
            range.current.style.width = `${maxPercent - minPercent}%`;
        }
    }, [maxVal, getPercent]);

    // Get min and max values when their state changes
    useEffect(() => {
        if (minVal != minValRef.current || maxVal != maxValRef.current) {
            onChange({ min: minVal, max: maxVal })
            minValRef.current = minVal
            maxValRef.current = maxVal
            // console.log({ min: minVal, max: maxVal })
        }
    }, [minVal, maxVal, onChange])

    return (
        <div className='w-full flex items-center justify-center flex-col space-y-14 multi-range-slider-container'>

            {/* Display Price Value */}
            <div className={`w-full flex items-center justify-between gap-x-5 mb-2`}>

                <p className="text-sm text-gray-500 font-semibold">
                    {minVal}
                </p>

                <div className="flex-1 border-dashed border border-gray-100 mt-1"></div>

                <p className="text-sm text-gray-500 font-semibold">
                    {maxVal}
                </p>

            </div>


            {/* Style the price range slider */}
            <div className="multi-slide-input-container" style={{ width }}>

                <input
                    type="range"
                    min={min}
                    max={max}
                    value={minVal}
                    onChange={(event) => {
                        const value = Math.min(Number(event.target.value), maxVal - 1);
                        setMinVal(value);
                    }}
                    className="thumb thumb-left"
                    style={{
                        width,
                        zIndex: minVal > max - 100 || minVal === maxVal ? 5 : undefined,
                    }}
                />

                <input
                    type="range"
                    min={min}
                    max={max}
                    value={maxVal}
                    onChange={(event) => {
                        const value = Math.max(Number(event.target.value), minVal + 1);
                        setMaxVal(value);
                    }}
                    className="thumb thumb-right"
                    style={{
                        width,
                        zIndex: minVal > max - 100 || minVal === maxVal ? 4 : undefined,
                    }}
                />

                <div className="slider">
                    <div
                        style={{ backgroundColor: trackColor }}
                        className="track-slider"
                    />

                    <div
                        ref={range}
                        style={{ backgroundColor: rangeColor }}
                        className="range-slider"
                    />

                </div>

            </div>

        </div>
    )
}

export default MultiRangeSlider