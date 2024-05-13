<script lang="ts">
  import SuperDebug, { superForm } from 'sveltekit-superforms';
  import type { PageData } from './$types';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import { formSchema } from './schema';
  import { Button } from '$lib/components/ui/button';

  export let data: PageData;

  const form = superForm(data.form, {
    dataType: 'json',
    validators: zodClient(formSchema)
  });
  const { form: formData, enhance, submitting } = form;

  function addItem() {
    $formData.tags = [
      ...$formData.tags,
      {
        name: '',
        description: '',
        time: ''
      }
    ];
  }

  function deleteItem(i: number) {
    $formData.tags.splice(i, 1);
    $formData.tags = [...$formData.tags];
  }
</script>

<SuperDebug data={$formData} />

<Button on:click={addItem}>Add</Button>

<form method="POST" use:enhance>
  {#each $formData.tags as _, i}
    <div class="border p-2">
      <input type="text" name="name" bind:value={$formData.tags[i].name} placeholder="name" />
      <input
        type="text"
        name="description"
        bind:value={$formData.tags[i].description}
        placeholder="description"
      />
      <input type="date" name="time" bind:value={$formData.tags[i].time} placeholder="date" />
    </div>
    <Button variant="destructive" on:click={() => deleteItem(i)}>Delete</Button>
  {/each}
  <button type="submit">submit</button>
</form>
