<script lang="ts">
  import BackButton from "../../components/BackButton.svelte";
  import ContentFrame from "../../components/layout/ContentFrame.svelte";
  import Link from "../../components/Link.svelte";
  import Header from "../../components/type/Header.svelte";
  import CONFIG from "../../data/config";

  let reloadSuppressed = false;
  (async function () {
    reloadSuppressed = await CONFIG.getDevSuppressBeforeUnload();
  })();
</script>

<ContentFrame>
  <BackButton href="/" />
  <Header>Developer tools</Header>
  <p>
    <Link href="/dev/DBEditor">Database inspector</Link>
  </p>
  <p>
    <Link href="/dev/component-library/">Component library</Link>
  </p>

  <Header>Developer configuration</Header>
  <p>
    Prevent reload/close while tracking:
    <button
      on:click={() => {
        reloadSuppressed = !reloadSuppressed;
        CONFIG.setDevSuppressBeforeUnload(reloadSuppressed);
      }}>{reloadSuppressed ? 'suppressed' : 'normal'}</button>
  </p>
</ContentFrame>
