/**
 * @param a and b are sorted obj from the array
 * @param field: array of the fields you want to sort by.
 * You should pass the fields in order from the last important one to the most important
 */
export function sortObjBy<T extends object>(a: T, b: T, fields: (keyof T)[] | keyof T) {
    if (!Array.isArray(fields)) fields = [fields];
    for (const field of fields) {
        if (a[field] < b[field]) {
            return -1;
        }
        if (a[field] > b[field]) {
            return 1;
        }
    }
    return 0;
}
