<script lang="ts">
  import EntityChooser from "../../components/dev/DBEditor/EntityChooser.svelte";
  import EntityEditor from "../../components/dev/DBEditor/EntityEditor.svelte";
  import { createTrigger } from "../../util/trigger";
  import type { EntityName } from "../../data/schema";
  import BackButton from "../../components/BackButton.svelte";
  let type: EntityName, id: string;

  const [setView, setViewTrigger] =
    createTrigger<[EntityName, string | null]>();
</script>

<BackButton href="/" />
<div class="editor">
  <EntityChooser
    bind:selectedType={type}
    bind:selectedId={id}
    {setViewTrigger}
  />
  <EntityEditor entityType={type} {id} {setView} />
</div>

<style lang="scss">
  @import "src/styles/tokens.scss";

  .editor {
    max-width: 32rem;
    width: fit-content;
    margin: 2rem auto;
    background: $modal-background-color;
    border-radius: 4px;
    box-shadow: 0 4px 20px -10px rgba(black, 0.35);
    padding: 1rem;
    margin-top: 1rem;
  }
</style>
