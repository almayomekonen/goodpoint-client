/**this function inserts an element to its correct place in a sorted array
 *
 * @param arr the array of elements
 * @param compareFunction function that compares between two elements, returns true if the first element is 'bigger' than the second element
 */
export function insertAndSort(arr: any[], compareFunction: (a: any, b: any) => boolean, value: any) {
    //copy the array
    const copyArr = [...arr];

    //find the index of the element that is bigger than the value
    let low = 0,
        high = arr.length;

    while (low < high) {
        //getting the middle index
        const mid = (low + high) >>> 1;
        if (compareFunction(value, copyArr[mid])) low = mid + 1;
        else high = mid;
    }

    //insert the value to the correct place
    copyArr.splice(low, 0, value);
    return copyArr;
}
