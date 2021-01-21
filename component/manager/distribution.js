import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts/highmaps';
import { useEffect, useState } from 'react';
import { getWorld } from '../../services/apiService'


export default function Distribution({ data, title }){
    const [world, setWorld] = useState(null);
    const [options,setOptions] = useState({
        colorAxis: {
            min: 0,
            stops: [
              [0, '#fff'],
              [0.5, Highcharts.getOptions().colors[0]],
              [1, '#1890ff'],
            ],
          },
          legend: {
            layout: 'vertical',
            align: 'left',
            verticalAlign: 'bottom',
          },
          credits: {
            enabled: false,
          },
          exporting: {
            enabled: false,
          }
    })
    useEffect(() => {
        (async () => {
          const res = await getWorld();
            console.log(res)
          setWorld(res.data);
          setOptions({
            series: [{ mapData: res.data }],
          });
        })();
      }, []);

      useEffect(() => {
        if (!data || !world) {
          return;
        }
    
        const mapSource = data.map((item) => {
          const target = world.features.find(
            (feature) => item.name.toLowerCase() === feature.properties.name.toLowerCase()
          );
    
          return !!target
            ? {
                'hc-key': target.properties['hc-key'],
                value: item.amount,
              }
            : {};
        });
        const options = { 
          title: {
            text: `<span style="text-transform: capitalize">${title
              .split(/(?=[A-Z])/)
              .join(' ')}</span>`,
          },
          series: [
            {
              data: mapSource,
              mapData: world,
              name: 'Total',
              states: {
                hover: {
                  color: '#a4edba',
                },
              },
            },
          ],
        };
    
        setOptions(options);
      }, [data, world]);
    
    return(
        <HighchartsReact
        highcharts={Highcharts}
        constructorType={'mapChart'}
        options={options}
        >
        </HighchartsReact>
    )
}