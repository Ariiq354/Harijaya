<script lang="ts">
  import { Bar } from 'svelte-chartjs';
  import type { ChartData } from 'chart.js';
  import { Chart, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
  import { getLastMonths } from '$lib/utils';

  const config: ChartData<'bar', (number | [number, number])[], unknown> = {
    labels: getLastMonths(4),
    datasets: [
      {
        label: 'Pembelian',
        data: [12, 19, 3, 5, 2, 3],
        backgroundColor: 'lightblue'
      },
      {
        label: 'Penjualan',
        data: [12, 19, 3, 5, 2, 3].reverse(),
        backgroundColor: 'blue'
      }
    ]
  };

  Chart.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
</script>

<Bar
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
