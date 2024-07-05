<script lang="ts">
  import { enhance } from '$app/forms';
  import { page } from '$app/stores';
  import * as Accordion from '$lib/components/ui/accordion';
  import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
  import * as Sheet from '$lib/components/ui/sheet';
  import { cn } from '$lib/utils';
  import { LogOut, Menu, User } from 'lucide-svelte';
  import { sidebarItem } from './SidebarItem';
  import Button from './ui/button/button.svelte';

  let isOpen = false;
  let form: HTMLFormElement;

  function submitForm() {
    form.submit();
  }
</script>

<div class="sticky top-0 z-10 border-b-2 border-black bg-white">
  <div class="z-20 flex h-full w-full justify-between gap-4 p-4 md:justify-end">
    <Sheet.Root open={isOpen} onOpenChange={(open) => (isOpen = open)}>
      <Sheet.Trigger class="block md:hidden">
        <Menu />
      </Sheet.Trigger>
      <Sheet.Content side="left">
        <Sheet.Header>
          <Sheet.Title class="text-start">Harijaya | Menu</Sheet.Title>
          <hr />
        </Sheet.Header>
        <div class="py-4">
          <Accordion.Root>
            <div class="flex flex-col">
              {#each sidebarItem as item, i}
                {#if !item.child}
                  <a
                    href={item.href}
                    class={cn(
                      $page.url.pathname == item.href ? 'text-foreground' : 'text-gray-500',
                      'py-2 hover:text-foreground'
                    )}
                    on:click={() => (isOpen = false)}
                  >
                    <div class="flex items-center font-medium">{item.title}</div>
                  </a>
                {:else}
                  <Accordion.Item value={'item-' + i}>
                    <Accordion.Trigger class="py-2 text-gray-500 hover:text-foreground">
                      {item.title}
                    </Accordion.Trigger>
                    <div class="pl-9">
                      <Accordion.Content>
                        <Accordion.Root>
                          <div class="flex flex-col gap-4">
                            {#each item.child as child, j}
                              {#if !child.child}
                                <a
                                  href={child.href}
                                  class={cn(
                                    $page.url.pathname == child.href
                                      ? 'text-foregorund'
                                      : 'text-gray-500',
                                    'font-medium hover:text-foreground'
                                  )}
                                  on:click={() => (isOpen = false)}
                                >
                                  {child.title}
                                </a>
                              {:else}
                                <Accordion.Item value={'child-' + j}>
                                  <Accordion.Trigger
                                    class="py-0 text-gray-500 hover:text-foreground"
                                  >
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
                                          on:click={() => (isOpen = false)}
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
                    </div>
                  </Accordion.Item>
                {/if}
              {/each}
            </div>
          </Accordion.Root>
        </div>
      </Sheet.Content>
    </Sheet.Root>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <Button variant="outline" class="rounded-full p-2" title="User Menu">
          <User />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content align="end">
        <form bind:this={form} method="post" action="/?/logout" use:enhance>
          <DropdownMenu.Item on:click={submitForm}>
            <LogOut class="mr-2 h-4 w-4" />
            Log out
          </DropdownMenu.Item>
        </form>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </div>
</div>
