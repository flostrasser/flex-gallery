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
