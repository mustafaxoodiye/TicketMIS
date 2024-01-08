
import React from 'react';

import { ComplexHeader } from './types';

interface Props {
    headers: ComplexHeader[];
    hasActions?: boolean;
    totals?: { [key: string]: number };
    showCounter?: boolean;
}

export const TFoot: React.FC<Props> = (props) => {
    if (props.totals && Object.keys(props.totals).length > 0) {
        // const totalFields = props.headers.filter(f => f.total) ?? [];

        return (
            <tfoot >
                <tr>
                    {props.showCounter && <th className="text-center">Totals</th>}
                    {props.headers.map(field => {
                        if (!field.total) return (<th></th>)

                        const total = props.totals![field.key];
                        const formattedValue = field.total?.format === 'currency' ? total.toCurrency(field.total.currency) : total.format();

                        let className = field.format === "currency" || field.format === "number" ? "text-center" : "";

                        return (
                            <th key={`totals-${field.key}`} colSpan={field.total?.colSpan} className={className}>
                                {field.total?.message} {formattedValue}
                            </th>
                        );
                    })
                    }
                </tr>
            </tfoot>
        );
    }

    return (
        <tfoot>
            <tr>
                {props.showCounter && <th className="text-center">#</th>}
                {props.headers.map((header, index) => {
                    if (typeof header == 'string') {
                        return (<th key={`heading-${index}`}>{header}</th>);
                    }

                    return (
                        <th key={`heading-${header.key}`}>{header.title ? header.title : header.key}</th>
                    );
                })}

                {props.hasActions && (
                    <th className="text-center" key={'actions'}>Actions</th>
                )}
            </tr>
        </tfoot>
    );
}