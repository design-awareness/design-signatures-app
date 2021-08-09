<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import { replace } from "svelte-spa-router/Router.svelte";
  import { delay } from "../util/delay";

  export let params: { n: string };

  (async function () {
    try {
      let n = parseInt(params.n);

      if (n > 1) {
        await replace(`/update/${n - 1}`);
      } else {
        await replace("/");
      }
      await delay(50);
      location.reload();
    } catch (e) {
      replace("/");
    }
  })();
</script>
