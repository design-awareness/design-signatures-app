<script lang="ts">
  import EntityChooser from "../../components/dev/DBEditor/EntityChooser.svelte";
  import EntityEditor from "../../components/dev/DBEditor/EntityEditor.svelte";
  import { createTrigger } from "../../util/trigger";
  import type { DBModelName } from "../../data/schema";
  let type: DBModelName, id: string;

  const [setView, setViewTrigger] = createTrigger<[DBModelName, string]>();
</script>

<style lang="scss">
  .editor {
    max-width: 32rem;
    width: fit-content;
    margin: 2rem auto;
    background: white;
    border-radius: 4px;
    box-shadow: 0 4px 20px -10px rgba(black, 0.35);
    padding: 1rem;
  }

  .container {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(black, 0.04);
  }
</style>

<div class="container">
  <div class="editor">
    <EntityChooser
      bind:selectedType={type}
      bind:selectedId={id}
      {setViewTrigger} />
    <EntityEditor entityType={type} {id} {setView} />
  </div>
</div>
