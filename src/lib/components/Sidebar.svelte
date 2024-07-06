<script lang="ts">
  import { page } from '$app/stores';
  import * as Accordion from '$lib/components/ui/accordion';
  import { cn } from '$lib/utils';
  import { sidebarItem } from './SidebarItem';
</script>

<div
  class="sticky left-0 top-0 z-10 hidden h-screen w-72 flex-col border-r-2 border-black bg-white shadow-xl md:flex"
>
  <!-- Logo -->
  <div
    class="flex w-full items-center justify-center gap-4 border-b-2 border-black px-4 py-3 text-2xl"
  >
    <img src="/hrj.png" alt="logo" class="h-12" />
    <!-- <h1 class="font-serif">HARIJAYA</h1> -->
  </div>

  <div class="p-4">
    <Accordion.Root>
      <div class="flex flex-col gap-2">
        {#each sidebarItem as item, i}
          {#if !item.child}
            <a
              href={item.href}
              class={cn(
                $page.url.pathname == item.href ? 'text-foreground' : 'text-gray-500',
                'flex items-center gap-3 py-2 hover:text-foreground'
              )}
            >
              <svelte:component this={item.icon} />
              <div class="flex items-center font-medium">{item.title}</div>
            </a>
          {:else}
            <Accordion.Item value={'item-' + i}>
              <Accordion.Trigger class="py-2 text-gray-500 hover:text-foreground">
                <div class="flex items-center gap-3">
                  <svelte:component this={item.icon} />
                  {item.title}
                </div>
              </Accordion.Trigger>
              <Accordion.Content class="pl-9">
                <Accordion.Root>
                  <div class="flex flex-col gap-4">
                    {#each item.child as child, j}
                      {#if !child.child}
                        <a
                          href={child.href}
                          class={cn(
                            $page.url.pathname == child.href ? 'text-foregorund' : 'text-gray-500',
                            'font-medium hover:text-foreground '
                          )}
                        >
                          {child.title}
                        </a>
                      {:else}
                        <Accordion.Item value={'child-' + j}>
                          <Accordion.Trigger class="py-0 text-gray-500 hover:text-foreground">
                            {child.title}
                          </Accordion.Trigger>
                          <Accordion.Content class="pl-9 pt-2">
                            <div class="flex flex-col gap-4">
                              {#each child.child as grandChild}
                                <a
                                  href={grandChild.href}
                                  class={cn(
                                    $page.url.pathname == grandChild.href
                                      ? 'text-foregorund'
                                      : 'text-gray-500',
                                    'font-medium hover:text-foreground '
                                  )}
                                >
                                  {grandChild.title}
                                </a>
                              {/each}
                            </div>
                          </Accordion.Content>
                        </Accordion.Item>
                      {/if}
                    {/each}
                  </div>
                </Accordion.Root>
              </Accordion.Content>
            </Accordion.Item>
          {/if}
        {/each}
      </div>
    </Accordion.Root>
  </div>
</div>
