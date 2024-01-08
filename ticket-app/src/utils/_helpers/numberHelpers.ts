declare global {
    interface Number {
        /**
         * Format the given value into currency format, like $10,000.50
         */
        toCurrency: (currency?: string) => string;

        /**
         * Format the given value into human readable format, like 10,000.
         */
        format: () => string;
    }
}

// eslint-disable-next-line no-extend-native
// Number.prototype.toCurrency = function(): string {
//     console.log('Value is', this);
//     return "";
// }

// .toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")

export default Number;