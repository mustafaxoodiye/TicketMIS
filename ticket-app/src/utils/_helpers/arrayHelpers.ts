declare global {
    interface Array<T> {

        /**
         * Checks if the array is empty. 
         */
        isEmpty: () => boolean;

        /**
         * 
         */
        any: () => boolean;

        /**
         * Filters an array if cond is true.
         */
        filterIf: (cond: boolean, func: (item: T) => boolean) => T[];

    }
}

export default Array;