// eslint-disable-next-line no-extend-native
Number.prototype.toCurrency = function (currency = "$") {
    try {
        let value = this.toFixed(2);
        if (value === "-0.00") {
            value = "0.00"; // Very weird way of removing minus sign from the value!
        }

        return currency + value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    } catch {
        return "$0.00";
    }
}

// eslint-disable-next-line no-extend-native
Number.prototype.format = function () {
    try {
        let value = this;
        if (value.toFixed && value.toString().includes('.')) {
            value = this.toFixed(2);
        }

        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    } catch {
        return "0";
    }
}

// eslint-disable-next-line no-extend-native
Array.prototype.isEmpty = function () {
    return this && this.length === 0;
}

// eslint-disable-next-line no-extend-native
Array.prototype.any = function (func) {
    return this && this.some(func || function (x) { return x });
}

// eslint-disable-next-line no-extend-native
Array.prototype.filterIf = function (cond, func) {
    if (!this) return [];
    if (!cond || !func) return this;

    return this.filter(func);
}

// eslint-disable-next-line no-extend-native
String.prototype.capitalize = function () {
    return this && this.replace(/(?:^|\s)\S/g, function (a) { return a.toUpperCase(); });
}
