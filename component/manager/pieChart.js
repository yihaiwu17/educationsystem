import Highcharts, { reduce } from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { useEffect, useState } from 'react';

export default function PieChart({ data, title }) {
  const [options, setOptions] = useState({
    chart: {
      plotBackgroundColor: null,
      plotBorderWidth: null,
      plotShadow: false,
      type: 'pie',
    },
    tooltip: {
      pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format: '<b>{point.name}</b>: {point.percentage:.1f} %',
          style: {
            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black',
          },
        },
      },
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: false,
    },
  });

  useEffect(() => {
    if (!data) {
      return;
    }

    const source = data?.map((item) => ({ name: item.name, y: item.amount }));
    setOptions({
      title: {
        text:  title ,
      },
      subtitle: {
        text: `${title.split(' ')[0]} total: ${source.reduce((acc, cur) => acc + cur.y, 0)}`,
        align:'right'
      },
      series: [
        {
          name: 'percentage',
          colorByPoint: true,
          data: source,
        },
      ],
    });
  }, [data]);

  return <HighchartsReact highcharts={Highcharts} options={options}></HighchartsReact>;
}
