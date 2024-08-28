<script lang="ts">
  import { goto } from '$app/navigation';
  import * as Card from '$lib/components/ui/card';
  import * as Form from '$lib/components/ui/form';
  import { Input } from '$lib/components/ui/input';
  import { Loader2 } from 'lucide-svelte';
  import { toast } from 'svelte-sonner';
  import { superForm } from 'sveltekit-superforms';
  import { zodClient } from 'sveltekit-superforms/adapters';
  import type { PageData } from './$types';
  import { formSchema } from './schema';

  export let data: PageData;

  const form = superForm(data.form, {
    validators: zodClient(formSchema),

    async onUpdate({ result }) {
      if ((result.type = 'success')) {
        toast.success('Login sukses');
        await goto('/dashboard');
      }
    },

    onError(event) {
      toast.error(event.result.error.message);
    }
  });

  const { form: formData, enhance, submitting } = form;
</script>

<Card.Root class="w-full max-w-md border-2 border-primary shadow-xl">
  <form method="POST" use:enhance action="?/login">
    <Card.Header>
      <Card.Title class="text-center text-2xl font-bold">Login</Card.Title>
    </Card.Header>
    <Card.Content>
      <Form.Field {form} name="username">
        <Form.Control let:attrs>
          <Form.Label>Username</Form.Label>
          <Input {...attrs} bind:value={$formData.username} />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
      <Form.Field {form} name="password">
        <Form.Control let:attrs>
          <Form.Label>Password</Form.Label>
          <Input {...attrs} bind:value={$formData.password} type="password" />
        </Form.Control>
        <Form.FieldErrors />
      </Form.Field>
    </Card.Content>
    <Card.Footer class="flex w-full flex-col gap-4">
      <Form.Button disabled={$submitting} class="w-full">
        {#if $submitting}
          <Loader2 class="mr-2 h-4 w-4 animate-spin" />
        {/if}
        Submit
      </Form.Button>
      <p>
        Not Registered? <a href="/register" class="text-blue-500 hover:text-blue-300"
          >Create an account</a
        >
      </p>
    </Card.Footer>
  </form>
</Card.Root>
