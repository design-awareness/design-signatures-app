<script lang="ts">
  import ActivityToggle from "../../components/ActivityToggle.svelte";
  import ContentFrame from "../../components/layout/ContentFrame.svelte";

  let color = "#000000";
  let checked = false;
  let name = "Activity";
</script>

<ContentFrame>
  <h1>ActivityToggle</h1>
  <p>
    <ActivityToggle color={color.substr(1)} bind:checked activityName={name} />
  </p>
  <hr />
  <h2>Properties</h2>
  <p><code>color</code> <input type="color" bind:value={color} /></p>
  <p><code>activityName</code> <input type="text" bind:value={name} /></p>
  <h2>Bindings</h2>
  <p><code>checked</code> <input type="checkbox" bind:checked /></p>
</ContentFrame>
