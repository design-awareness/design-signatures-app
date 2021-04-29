<script lang="ts">
  import BackButton from "../../../components/BackButton.svelte";
  import ContentFrame from "../../../components/layout/ContentFrame.svelte";
  import Header from "../../../components/type/Header.svelte";
  import { makeCanvasAction } from "../../../util/canvas";

  let i1 = 0;
  let i2 = 0;

  let [canvasAction1, triggerDraw1] = makeCanvasAction({
    draw(ctx, w, h) {
      i1++;
      ctx.textBaseline = "top";
      ctx.fillStyle = "black";
      ctx.font = "18px monospace";
      ctx.fillText(`i: ${i1}; w: ${w}; h: ${h}`, 0, 0);
    },
    clear: true,
  });

  let [canvasAction2] = makeCanvasAction({
    draw(ctx, w, h) {
      i2++;
      ctx.textBaseline = "top";
      ctx.fillStyle = "black";
      ctx.font = "18px monospace";
      ctx.fillText(`i: ${i2}; w: ${w}; h: ${h}`, 0, 0);
      ctx.fillStyle = "blue";
      ctx.fillRect(i2 % w, 20, 4, h - 20);
    },
    clear: true,
    animate: true,
  });
</script>

<ContentFrame>
  <BackButton href="/dev/component-library/" />
  <Header>Static canvas</Header>
  <button on:click={triggerDraw1}>trigger redraw ({i1})</button>
  <canvas use:canvasAction1 />
  <Header>Animated canvas</Header>
  <canvas use:canvasAction2 />
</ContentFrame>

<style>
  canvas {
    width: 100%;
    height: 6rem;
    margin-bottom: 2px;
    border: 1px solid red;
  }
</style>
