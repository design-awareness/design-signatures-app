<script lang="ts">
  import ContentFrame from "../../components/layout/ContentFrame.svelte";
  import BackButton from "../../components/BackButton.svelte";
  import Header from "../../components/type/Header.svelte";
</script>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  .page {
    min-height: 100%;
  }

  img {
    list-style-type: none;
    padding: 1rem 0;
    display: flex;
    width: 100%;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-items: flex-start;
    justify-content: space-around;
  }

  figure {
    margin: $block-vertical-spacing auto;
  }

  figcaption {
    @include type-style($type-caption);
    color: $text-secondary-color;
    font-style: italic;
  }
</style>

<main class="device-frame page">
  <ContentFrame>
    <BackButton href="/" />
    <Header>Explore design process research</Header>
    <p>
      Atman's research suggests that the quality of people's designs are
      correlated to their design processes. During a study, participants were
      tasked with design activities and asked to give verbal reports about what
      they were doing during their process. Codes were then assigned to define
      what a user was doing at a given instant.
    </p>
    <p>
      Codes were recorded in timely intervals and​ converted into timelines and
      classified based on their quality. Findings show that individuals with
      expertise & high-quality designs have processes that are more complex,
      consider a broader set of information, spend more time problem solving and
      are more likely to demonstrate a cascade pattern (bottom right of figure
      2) in their design activities [1].
    </p>
    <figure>
      <img src="images/timeline.png" alt="notfound" />
      <figcaption>
        [1] Atman, C.J., Adams, R.S., Cardella, M.E., Turns, J., Mosborg, S. and
        Saleem, J. (2007), Engineering Design Processes: A Comparison of
        Students and Expert Practitioners. Journal of Engineering Education, 96:
        359-379. doi:10.1002/j.2168-9830.2007.tb00945.x
      </figcaption>
    </figure>

    <p>
      Below are three types of timelines produced by college freshmen. The first
      timeline represents a low quality design and it can be seen that not much
      time was spent on any of the activity codes. The second timeline represnts
      a medium quality design, it can be seen that most of the time is spent on
      modelling, and not many transitions take place to the other design
      activities. The last one is a high quality timeline, and it can be seen
      that the designer made a lot of transition between all the design
      activities and demonstrates a cascade shaped pattern.
    </p>
    <figure>
      <img src="images/threetimeline.png" alt="not  found" />
      <figcaption>
        [1] Atman, C.J., Adams, R.S., Cardella, M.E., Turns, J., Mosborg, S. and
        Saleem, J. (2007), Engineering Design Processes: A Comparison of
        Students and Expert Practitioners. Journal of Engineering Education, 96:
        359-379. doi:10.1002/j.2168-9830.2007. tb00945.x
      </figcaption>
    </figure>
  </ContentFrame>
</main>
