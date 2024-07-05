<script lang="ts">
  //@ts-nocheck
  import { CldUploadWidget } from 'svelte-cloudinary';
  import { Button } from '$lib/components/ui/button';
  import { ImagePlus, Trash } from 'lucide-svelte';


  export let disabled: boolean;
  export let onChange: (value: string) => void;
  export let onRemove: (value: string) => void;
  export let url: string;

  const onUpload = (result: any) => {
    onChange(result.info.secure_url);
  };
</script>

<div>
  <div class="mb-4 flex items-center gap-4">
    {#if url.length != 0}
      <div class="relative h-[200px] w-[200px] overflow-hidden rounded-md">
        <div class="absolute right-2 top-2 z-10">
          <Button type="button" on:click={() => onRemove(url)} variant="destructive" size="sm">
            <Trash className="h-4 w-4" />
          </Button>
        </div>
        <a href={url} target="_blank">
          <img class="h-full object-cover" alt="cloudinary" src={url} />
        </a>
      </div>
    {/if}
  </div>
  <CldUploadWidget {onUpload} uploadPreset="agqxxd1f" let:open>
    <Button type="button" {disabled} on:click={open}>
      <ImagePlus className="h-4 w-4 mr-2" />
      Upload an Image
    </Button>
  </CldUploadWidget>
</div>
