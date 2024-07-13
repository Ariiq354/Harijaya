<script lang="ts">
  import { navigating } from '$app/stores';
  import { cn } from '$lib/utils';
  import { onDestroy } from 'svelte';

  function defaultEstimatedProgress(duration: number, elapsed: number): number {
    const completionPercentage = (elapsed / duration) * 100;
    return (2 / Math.PI) * 100 * Math.atan(completionPercentage / 50);
  }

  export let duration: number = 2000;
  export let throttle: number = 300;

  let elapsed = 0;
  let progress = 0;
  let show = false;

  let interval: NodeJS.Timeout | undefined;
  let hideTimeout: NodeJS.Timeout | undefined;
  let resetTimeout: NodeJS.Timeout | undefined;

  function startTimer() {
    show = true;
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      elapsed += 10;
    }, 10);
  }

  function stopTimer() {
    if (interval) clearInterval(interval);
    progress = 100;
  }

  $: if ($navigating) {
    startTimer();
  } else {
    stopTimer();
    hideTimeout = setTimeout(() => {
      show = false;
      resetTimeout = setTimeout(() => {
        elapsed = 0;
        progress = 0;
      }, 200);
    }, throttle);
  }

  $: progress = defaultEstimatedProgress(duration, elapsed);
  $: style = `background-size: ${(100 / progress) * 100}% auto; transform: scaleX(${progress}%)`;

  onDestroy(() => {
    clearInterval(interval);
    clearTimeout(hideTimeout);
    clearTimeout(resetTimeout);
  });
</script>

<div
  {style}
  class={cn(
    `pointer-events-none fixed left-0 right-0 top-0 z-50 h-[5px] w-auto origin-left bg-gradient-to-r from-[#00dc82] via-[#34cdfe] to-[#0047e1] transition-all duration-300`,
    show ? 'opacity-100' : 'opacity-0'
  )}
/>
