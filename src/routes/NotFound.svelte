<script lang="ts">
  import notFoundIcon from "@iconify-icons/ic/baseline-broken-image";
  import Link from "../components/Link.svelte";
  import SplashScreen from "../components/SplashScreen.svelte";
</script>

<SplashScreen icon={notFoundIcon} label="Page not found.">
  <Link href="/">Go home</Link>
</SplashScreen>

<style lang="scss">
</style>
