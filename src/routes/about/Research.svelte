<!--
  Copyright (c) 2021, Design Awareness Contributors.
  SPDX-License-Identifier: BSD-3-Clause
-->
<script lang="ts">
  import BackButton from "../../components/BackButton.svelte";
  import ContentFrame from "../../components/layout/ContentFrame.svelte";
  import PageSeparator from "../../components/PageSeparator.svelte";
  import Header from "../../components/type/Header.svelte";
  import SectionHeader from "../../components/type/SectionHeader.svelte";
  import Figure from "..//../components/Figure.svelte";
</script>

<main class="device-frame page">
  <ContentFrame>
    <BackButton href="/" />
    <Header>Explore design process research</Header>
    <p>
      This app was informed by research on design processes. Process is
      important because research has shown that a good design process leads to a
      good design product. Here we present key findings from some of that
      research to motivate you to question and reflect on your own design
      process.
    </p>

    <Header>Design Expertise</Header>
    <p>
      Cindy Atman, one of the authors of this app, has conducted research on
      design expertise for several decades. This research shows that expert
      designers use different processes than novice designers. In one large
      study, engineering designers with various levels of expertise designed a
      playground where they talked aloud during their design process.
      Researchers then analyzed these processes and assessed the quality of
      their final design products.
    </p>
    <p>
      As part of the analysis, researchers categorized the activities that the
      designers engaged in and visualized those activities as timelines. These
      timelines, or “design signatures”, are representations of the design
      activities the designers engaged with over time. The patterns of design
      activities over time were used to identify key attributes of a high
      quality design process.
    </p>

    <Figure
      path="research/code-set.svg"
      alt="list of activity names and codes used in the research"
    />

    <p>
      Below are design signatures from first-year and graduating senior
      students.
    </p>
    <ul class="list">
      <li>
        [Freshman A] This visualization represents a design signature of a
        first-year designer who created a low quality design. One key pattern
        seen here is that not much time was spent on any of the activities.
        <Figure
          path="research/timeline-a-freshman.png"
          alt="a design timeline representing low quality design"
        />
      </li>
      <li>
        [Freshman B] This visualization represents a design signature of a
        first-year designer who created a medium quality design. One key pattern
        seen here is that most of the time was spent in the modeling activity
        without considering other design activities.
        <Figure
          path="research/timeline-b-freshman.png"
          alt="a design timeline representing a medium quality design"
        />
      </li>
      <li>
        [Senior C] This visualization represents a design signature of a
        graduating senior designer who created a high quality design.The
        designer spent a significant amount of time scoping the problem at the
        beginning of the process, gathered information throughout the process,
        made many iterations throughout, and demonstrated an overall cascade
        shaped pattern.
        <Figure
          path="research/timeline-c-senior.png"
          alt="a design timeline representing a medium quality design"
        />
      </li>
    </ul>

    <SectionHeader>Attributes of high quality design processes</SectionHeader>
    <p>
      Using the higher quality process as a canvas, each of these expert design
      behaviors can be seen. In this app, you can examine your design signatures
      and see if you are exhibiting expert behaviors such as these:
    </p>

    <p>Focus on Problem Scoping before Modeling</p>
    <Figure
      path="research/problem-scoping.png"
      alt="a design process timeline with an area of problem scoping highlighted"
    />

    <p>Gather Information throughout your process</p>
    <Figure
      path="research/gather-throughout.png"
      alt="a design process timeline with areas of gathering information highlighted"
    />

    <p>Remember to transition/iterate</p>
    <Figure
      path="research/iterate.png"
      alt="a design process timeline with areas of switching between activities/ iteration are highlighted"
    />

    <p>However, don’t forget to stay the course!</p>
    <Figure
      path="research/stay-the-course.png"
      alt="a design process timeline with areas of persisting in one activity are highlighted"
    />

    <p>
      Try to demonstrate a “cascade shape” pattern, or “ideal project envelope”
      where your signature moves from the top left down to the bottom right
    </p>
    <Figure
      path="research/cascade.png"
      alt="a design process timeline with a cascading shape drawn around it mephasizing the pattern of this design process"
    />

    <p class="citation">
      Atman, C. J. (2019). Design timelines: Concrete and sticky representations
      of design process expertise. Design Studies, 65, 125–151.
    </p>

    <p class="citation">
      Joya, A. J., Jordan, K., Washington, M. N., Barar, G., Gray, A., Sweem,
      R., & Atman, C. J. (2020, June). “Where I’ve Been, Where I Am, Where I’m
      Going”: Exploring Design Awareness through an Undergraduate Student
      Seminar. In 2020 ASEE Virtual Annual Conference Content Access.
    </p>

    <PageSeparator />

    <Header>Co-evolution of problem and solution</Header>

    <p>
      Design activities can fall under either the “problem space'' or the
      “solution space”. Work in the problem space includes any activities that
      enable designers to understand both the broad and specific attributes of
      the problem they are solving. Work in the solution space includes any
      activities that designers engage in that contribute to creating solutions
      for the problem. To illustrate, if you are designing a coffee mug—the
      problem space might include thinking about success criteria (easy to drink
      from, easy to clean). The solution space might include brainstorming
      different mug shapes or materials to use.
    </p>

    <p>
      Expert designers move between these two spaces, with the work in each
      space informing the other until there is a good “fit” between the problem
      understanding and proposed solution. In this way, the understanding of the
      problem and solution space “co-evolve”. In the coffee mug example,
      co-evolution might happen when building prototypes of different shapes in
      clay, you realize that some are too heavy to be very usable and jump back
      to problem space where our understanding of the problem now includes
      weight requirements.
    </p>

    <p>
      There can be many iterations across problem and solution spaces. For
      example, a designer starts with activities to understand the problem
      (problem space). After generating some possible solutions (solution
      space), new questions come up to explore, lending to a refined
      understanding of the problem (problem space).
    </p>

    <p class="citation">
      Dorst, K. (2019). Co-evolution and emergence in design. Design Studies,
      65, p. 60–77.
    </p>

    <p class="citation">
      K. Dorst and N. Cross (2001). “Creativity in the design process:
      Co-evolution of problem–solution,” Design Studies, vol. 22, no. 5, p.
      425–437.
    </p>

    <PageSeparator />

    <Header>Diverging/Converging activities</Header>
    <p>
      Design activities can be either divergent or convergent, and both move the
      project forward. Divergent activities help to make the problem or solution
      space bigger, exploring broad possibilities and increasing ambiguity.
      Convergent activities help decrease ambiguity, and move towards decisions
      and concrete outcomes. To illustrate, if you are designing a poster you
      might brainstorm lots of ideas for the content—this would be divergent.
      Then you might decide on 3 concepts to prototype—this would be convergent.
    </p>
    <p>
      While a design process could have many phases of divergent/convergent
      activities, a popular model with two phases is called the “Double Diamond”
      model created by the British Design Council. This model traverses two
      diverge/converge phases, one in the problem space (discover, define) and
      one in the solution space (develop, deliver).
    </p>
    <p class="citation">
      Banathy, Bela H. (2013). Designing Social Systems in a Changing World.
      Germany, Springer US, p. 75.
    </p>
    <p class="citation">
      Eris, O. (2004). Effective inquiry for innovative engineering design (Vol.
      10). Springer Science & Business Media.
    </p>
    <p class="citation">
      Scalone, G., Atman, C. J., Mejia, K., Twigg-Smith, H., Shroyer, K., &
      Joya, A. (2020). Dealing with Ambiguity: Leveraging Different Types of
      Expertise to Guide Design Questioning. International Journal of
      Engineering Education, 36(2), p. 773–795.
    </p>
  </ContentFrame>
</main>

<style lang="scss">
  @import "src/styles/tokens";
  @import "src/styles/type";

  .page {
    min-height: 100%;
  }

  .citation {
    @include type-style($type-caption);
    color: $text-secondary-color;
    font-style: italic;
  }

  .list {
    padding-inline-start: 20px;
  }
</style>
