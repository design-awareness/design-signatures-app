<script lang="ts">
  import BackButton from "../../components/BackButton.svelte";
  import ContentFrame from "../../components/layout/ContentFrame.svelte";
  import Link from "../../components/Link.svelte";
  import Header from "../../components/type/Header.svelte";

  let reloadSuppressed: string = localStorage["dev__suppressBeforeUnload"];
</script>

<ContentFrame>
  <BackButton href="/" />
  <Header>Developer tools</Header>
  <p>
    <Link href="/dev/DBEditor">Database editor</Link>
  </p>
  <p>
    <Link href="/dev/component-library/">Component library</Link>
  </p>

  <Header>Developer configuration</Header>
  <p>
    Prevent reload/close while tracking:
    <button
      on:click={() => {
        if (reloadSuppressed === '1') {
          reloadSuppressed = localStorage['dev__suppressBeforeUnload'] = '0';
        } else {
          reloadSuppressed = localStorage['dev__suppressBeforeUnload'] = '1';
        }
      }}>{reloadSuppressed === '1' ? 'suppressed' : 'normal'}</button>
  </p>
</ContentFrame>
