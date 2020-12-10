<script lang="ts">
  import { pop } from "svelte-spa-router/Router.svelte";
  import BackButton from "../components/BackButton.svelte";
  import ContentFrame from "../components/layout/ContentFrame.svelte";
  import HorizontalScrollArea from "../components/layout/HorizontalScrollArea.svelte";
  import Link from "../components/Link.svelte";
  import Header from "../components/type/Header.svelte";
  import { getProject } from "../data/database";
  //import { getActivitySet } from "../data/database";
  import type { Project } from "../data/schema";
  //import type { ActivitySet } from "../data/schema";

  export let params: { id: string };

  let projectPromise: Promise<Project>;
  projectPromise = getProject(params.id);

  //let activitySetPromise: Promise<ActivitySet>;
  //activitySetPromise = getActivitySet(params.id);

  let active = true;
  async function remove() {
    active = false;
    await (await projectPromise).remove();
    pop();
  }
</script>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  .page {
    background-color: $background-color;
    min-height: 100%;
  }

  img {
    list-style-type: none;
    padding: 0;
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-items: flex-start;
    justify-content: space-around;
  }
</style>

<main class="device-frame page">
  <ContentFrame>
    <BackButton href="/" />
    {#await projectPromise}
      loading…
    {:then project}
      <Header>{project.name || 'No project here!'}</Header>
      <p>{project.description}</p>
      <br />
      <p style="font-size:75%;text-align:center;"><b>TRACKING OVERVIEW</b></p>

      <table>
        <tbody>
          <tr>
            <td>
              <ul style="list-style-type:none">
                {#each project.activitySet.activityCodes as activityCode, i}
                  <li>
                    <p style="color:#{project.activitySet.colors[i]};">
                      <b>{activityCode}</b>
                    </p>
                  </li>
                {/each}
              </ul>
            </td>
            <td><img src="images/videoholder.png" alt="notfound" /></td>
          </tr>
        </tbody>
      </table>
      <br />
      <p style="font-size:75%;text-align:center;"><b>PROJECT COMMENTS</b></p>

      <table>
        {#each project.notes as note}
          <tr>
            <td>{note.created}</td>
            <td>{note.contents}</td>
          </tr>
        {/each}
      </table>

      <button on:click={remove} disabled={!active}>delete</button>
    {/await}
  </ContentFrame>
</main>
