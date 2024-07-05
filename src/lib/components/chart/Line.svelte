<script lang="ts">
  import { Line } from 'svelte-chartjs';
  import type { ChartData, Point } from 'chart.js';
  import {
    Chart,
    Title,
    Tooltip,
    Legend,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement
  } from 'chart.js';
  import { getLastMonths } from '$lib/utils';

  const config: ChartData<'line', (number | Point)[], unknown> = {
    labels: getLastMonths(7),
    datasets: [
      {
        label: 'Pembelian',
        fill: true,
        backgroundColor: 'blue',
        tension: 0.3,
        borderColor: 'blue',
        borderCapStyle: 'butt',
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'black',
        pointBackgroundColor: 'blue',
        pointBorderWidth: 10,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'black',
        pointHoverBorderColor: 'blue',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [65, 59, 80, 81, 56, 55, 40]
      },
      {
        label: 'Penjualan',
        fill: true,
        tension: 0.3,
        backgroundColor: 'lightblue',
        borderColor: 'lightblue',
        pointBorderColor: 'black',
        pointBackgroundColor: 'lightblue',
        pointBorderWidth: 10,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'black',
        pointHoverBorderColor: 'lightblue',
        pointHoverBorderWidth: 2,
        pointRadius: 1,
        pointHitRadius: 10,
        data: [28, 48, 40, 19, 86, 27, 90]
      }
    ]
  };

  Chart.register(Title, Tooltip, Legend, LineElement, CategoryScale, LinearScale, PointElement);
</script>

<Line
  data={config}
  options={{
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    }
  }}
/>
