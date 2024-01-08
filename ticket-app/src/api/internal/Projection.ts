export class Projection {
    private selectedFields: string[] = ['*']
    private joinedTableName = '';
    private joinedFields: string[] = [];

    select<T>(...fields: (keyof T)[]) {

        this.selectedFields = fields as string[];

        return this;
    }

    join<T>(tableName: string, fields: (keyof T)[]) {
        this.joinedTableName = tableName;
        this.joinedFields = fields as string[];

        return this;
    }

    compute<T>(field: keyof T, functionName: string, params?: Record<string, unknown>) { // Record<string, unknown> is the same as {}

        return this;
    }

    build(): string[] {
        return [`${this.selectedFields},${this.joinedTableName} (${this.joinedFields})`]
    }
}
