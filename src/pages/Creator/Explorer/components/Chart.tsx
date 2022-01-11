import React from 'react';
import type { DualAxesConfig } from '@ant-design/charts';
import { DualAxes } from '@ant-design/charts';
import { getChartsData } from '@/services/subquery/subquery';
import { useEffect } from 'react';
import { useModel } from 'umi';

const Chart: React.FC<{
    adData: any,
}> = ({ adData }) => {
    const apiWs = useModel('apiWs');
    const [data, setData] = React.useState<any[]>([])
    const budget = BigInt(adData?.budget.replaceAll(',', ''));

    useEffect(() => {
        if (apiWs) {
            getChartsData(adData?.id, budget).then(res => setData(res));
        }
    }, [adData, budget, apiWs]);

    const config: DualAxesConfig = {
        data: [data, data],
        xField: 'time',
        yField: ['budget', 'viewer'],
        geometryOptions: [
            {
                geometry: 'line',
                color: '#5B8FF9',
            },
            {
                geometry: 'line',
                color: '#5AD8A6',
            },
        ],
        yAxis: {
            viewer: {
                min: 0,
                label: {
                    formatter: function formatter(val) {
                        return ''.concat(val, ' Viewers');
                    },
                },
            },
            budget: {
                min: 0,
                label: {
                    formatter: function formatter(val) {
                        return ''.concat(val, ' AD3');
                    },
                },
            }
        },
        legend: {
            custom: true,
            position: 'bottom',
            items: [
                {
                    value: 'value',
                    name: 'Viewers',
                    marker: {
                        symbol: 'square',
                        style: {
                            fill: '#5B8FF9',
                            r: 5,
                        },
                    },
                },
                {
                    value: 'count',
                    name: 'Budget',
                    marker: {
                        symbol: 'square',
                        style: {
                            fill: '#5AD8A6',
                            r: 5,
                        },
                    },
                },
            ],
        },
    };

    return <DualAxes {...config} />;
}

export default Chart;
