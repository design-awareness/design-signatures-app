<script lang="ts">
  import ActivityToggle from "../../../components/ActivityToggle.svelte";
  import BackButton from "../../../components/BackButton.svelte";
  import ContentFrame from "../../../components/layout/ContentFrame.svelte";
  import Header from "../../../components/type/Header.svelte";
  import SectionHeader from "../../../components/type/SectionHeader.svelte";

  let color = "#000000";
  let checked = false;
  let name = "Activity";
</script>

<ContentFrame>
  <BackButton href="/dev/component-library/" />
  <Header>ActivityToggle</Header>
  <p>
    <ActivityToggle color={color.substr(1)} bind:checked activityName={name} />
  </p>
  <hr />
  <SectionHeader>Bindings</SectionHeader>
  <p><code>checked</code> <input type="checkbox" bind:checked /></p>
  <SectionHeader>Props</SectionHeader>
  <p><code>color</code> <input type="color" bind:value={color} /></p>
  <p><code>activityName</code> <input type="text" bind:value={name} /></p>
</ContentFrame>
