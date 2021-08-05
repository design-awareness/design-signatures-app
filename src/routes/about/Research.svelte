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
      This app was informed by research on design processes.  Process is
      important because research has shown that a good design process leads to
      a good design product. Here we present key findings from some of that
      research to motivate you to question and reflect on your own design process.
    </p>
    <h3>Design Expertise</h3>
    <p>
      Cindy Atman, one of the authors of this app, has conducted research on
      design expertise for several decades. This research shows that expert
      designers use different processes than novice designers. In one large
      study, engineering designers with various levels of expertise designed
      a playground where they talked aloud during their design process.
      Researchers then analyzed these processes and assessed the quality of
      their final design products.  .
    </p>
    <p>
      As part of the analysis, researchers categorized the activities that the
      designers engaged in and visualized those activities as timelines. These
      timelines, or  “design signatures”, are representations of the design
      activities the designers engaged with over time. The patterns of design
      activities over time were used to identify key attributes of a high
      quality design process.
    </p>

    <img src="images/timeline.png" alt="notfound" />

    <p>
      Below are design signatures from first-year and graduating senior students.
    </p>
    <ul>
      <li>
        [Freshman A] This visualization represents a design signature of a
        first-year designer who created a low quality design. One key pattern
        seen here is that not much time was spent on any of the activities.
      </li>
      <li>
        [Freshman B] This visualization represents a design signature of a
        first-year designer who created a medium quality design. One key pattern
        seen here is that most of the time was spent in the modeling activity
        without considering other design activities.
      </li>
      <li>
        [Senior C] This visualization represents a design signature of a
        graduating senior designer who created a high quality design.The
        designer spent a significant amount of time scoping the problem at
        the beginning of the process, gathered information throughout the
        process, made many iterations throughout, and demonstrated an overall
        cascade shaped pattern.
      </li>
    </ul>

    <h4>Attributes of high quality design</h4>


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
