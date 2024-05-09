<script lang="ts">
  import * as Dialog from '$lib/components/ui/dialog';

  export let title: string;
  export let description: string;
  export let isOpen: boolean;
  export let onClose: () => void;

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };
</script>

<Dialog.Root open={isOpen} onOpenChange={onChange}>
  <Dialog.Content>
    <Dialog.Header>
      <Dialog.Title>{title}</Dialog.Title>
      <Dialog.Description>
        {description}
      </Dialog.Description>
    </Dialog.Header>
    <slot />
  </Dialog.Content>
</Dialog.Root>
