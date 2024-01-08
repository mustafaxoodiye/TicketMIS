import { BaseModel } from "@models";
import { Operation } from "./Operation";

export class Filter<T extends BaseModel> {
    field = '';
    operation: Operation = Operation.eq;
    value: any;

    private filters: Filter<T>[] = [];

    eq(field: keyof T, value: any): Filter<T> {
        const filter = new Filter();
        filter.field = field as string;
        filter.operation = Operation.eq;
        filter.value = value;

        this.filters.push(filter);
        filter.filters = this.filters;
        return filter;
    }

    gt(field: keyof T, value: any): Filter<T> {
        const filter = new Filter();
        filter.field = field as string;
        filter.operation = Operation.gt;
        filter.value = value;

        this.filters.push(filter);
        filter.filters = this.filters;
        return filter;
    }

    gte(field: keyof T, value: any): Filter<T> {
        const filter = new Filter();
        filter.field = field as string;
        filter.operation = Operation.gte;
        filter.value = value;

        this.filters.push(filter);
        filter.filters = this.filters;
        return filter;
    }

    lt(field: keyof T, value: any): Filter<T> {
        const filter = new Filter();
        filter.field = field as string;
        filter.operation = Operation.lt;
        filter.value = value;

        this.filters.push(filter);
        filter.filters = this.filters;
        return filter;
    }

    lte(field: keyof T, value: any): Filter<T> {
        const filter = new Filter();
        filter.field = field as string;
        filter.operation = Operation.lte;
        filter.value = value;

        this.filters.push(filter);
        filter.filters = this.filters;
        return filter;
    }

    like(field: keyof T, value: any): Filter<T> {
        const filter = new Filter();
        filter.field = field as string;
        filter.operation = Operation.like;
        filter.value = value;

        this.filters.push(filter);
        filter.filters = this.filters;
        return filter;
    }

    // any(field: keyof T, value: any[]): Filter<T> {
    //     const filter = new Filter();
    //     filter.field = field as string;
    //     filter.operation = Operation.any;
    //     filter.value = value;

    //     this.filters.push(filter);
    //     filter.filters = this.filters;
    //     return filter;
    // }

    // in(field: keyof T, value: any): Filter<T> {
    //     const filter = new Filter();
    //     filter.field = field as string;
    //     filter.operation = Operation.in;
    //     filter.value = value;

    //     this.filters.push(filter);
    //     filter.filters = this.filters;
    //     return filter;
    // }

    build(): Filter<T>[] {
        return this.filters ?? [];
    }

}