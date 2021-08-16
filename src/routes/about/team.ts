/*
 * Copyright (c) 2021, Design Awareness Contributors.
 * SPDX-License-Identifier: BSD-3-Clause
 */

import githubIcon from "@iconify-icons/mdi/github";
import instagramIcon from "@iconify-icons/mdi/instagram";
import linkedinIcon from "@iconify-icons/mdi/linkedin";
import websiteIcon from "@iconify-icons/mdi/web";
import type { IconifyIcon } from "../../types/IconifyIcon";

export interface TeamMemberProfile {
  name: string;
  pronouns: string;
  title: string;
  photo: string;
  links: ProfileLink[];
}

interface ProfileLink {
  url: string;
  icon: IconifyIcon;
  type: string;
}

const WEBSITE = {
  type: "Website",
  icon: websiteIcon,
};
const LINKEDIN = {
  type: "LinkedIn",
  icon: linkedinIcon,
};
const INSTAGRAM = {
  type: "Instagram",
  icon: instagramIcon,
};
const GITHUB = {
  type: "GitHub",
  icon: githubIcon,
};

const profiles: TeamMemberProfile[] = [
  {
    name: "Cindy Atman",
    pronouns: "she/her",
    title: "Professor & Mentor",
    photo: "bio/cindy.jpg",
    links: [
      {
        ...WEBSITE,
        url: "https://www.hcde.washington.edu/atman",
      },
      {
        ...INSTAGRAM,
        url: "https://www.instagram.com/design.timeline/",
      },
    ],
  },
  {
    name: "Jordan Yoon-Buck",
    pronouns: "he/they",
    title: "Lead Developer",
    photo: "bio/jordan.jpg",
    links: [
      {
        ...WEBSITE,
        url: "https://yoonbuck.com/",
      },
      {
        ...GITHUB,
        url: "https://github.com/yoonbuck/",
      },
      {
        ...LINKEDIN,
        url: "https://www.linkedin.com/in/yoonbuck/",
      },
    ],
  },
  {
    name: "Khadijah Jordan",
    pronouns: "she/her",
    title: "UX Designer",
    photo: "bio/khadijah.jpg",
    links: [
      {
        ...WEBSITE,
        url: "https://www.khajor.com/",
      },
      {
        ...INSTAGRAM,
        url: "https://www.instagram.com/buggbrain.s/",
      },
      {
        ...LINKEDIN,
        url: "https://www.linkedin.com/in/khajor/",
      },
    ],
  },
  {
    name: "Rylie Sweem",
    pronouns: "she/her",
    title: "UX Designer",
    photo: "bio/rylie.jpg",
    links: [
      {
        ...WEBSITE,
        url: "https://ryliesweem.com/",
      },
      {
        ...LINKEDIN,
        url: "https://www.linkedin.com/in/ryliesweem/",
      },
    ],
  },
  {
    name: "Grace Barar",
    pronouns: "she/her",
    title: "UX Designer",
    photo: "bio/grace.jpg",
    links: [
      {
        ...WEBSITE,
        url: "https://gracebarar.com/",
      },
      {
        ...LINKEDIN,
        url: "https://www.linkedin.com/in/gracebarar/",
      },
    ],
  },
  {
    name: "Shiva Rithwick Anem",
    pronouns: "he/him",
    title: "UX Designer",
    photo: "bio/shiva.jpg",
    links: [
      {
        ...WEBSITE,
        url: "https://mrshivaanem.wixsite.com/portfolio",
      },
      {
        ...LINKEDIN,
        url: "https://www.linkedin.com/in/shiva-rithwick/",
      },
    ],
  },
];

export default profiles;
