/**
 * Re-maps a number from one range to another.
 */
export const mapRange = (value, fromIn, toIn, fromOut, toOut) => fromOut + ((toOut - fromOut) * (value - fromIn)) / (toIn - fromIn);
/**
 * Re-maps a number from a range to a logarithmic scale
 */
export const mapLog = (value, min, max) => {
    const mapped = ((value - min) * (Math.log(max) - Math.log(min))) / (max - min) + Math.log(min);
    return Number(Math.exp(mapped).toFixed(10));
};
/**
 * Returns the index of an array, but loops around if the index is out of bounds
 */
export const getLoopedIndex = (array, index) => {
    if (index > array.length - 1)
        return 0;
    if (index < 0)
        return array.length - 1;
    return index;
};
