import { NavItem } from "@/lib/definitions";

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};

export const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/master/",
    icon: "dashboard",
    label: "Dashboard",
  },
  {
    title: "Election",
    href: "/master/election",
    icon: "vote",
    label: "Election",
  },
  {
    title: "Candidates",
    href: "/master/candidates",
    icon: "users",
    label: "Candidates",
  },
];

export type CandidateViewTab = {
  id?: string;
  value: string;
  label: string;
};

export const candidateViewTabs: CandidateViewTab[] = [
  {
    value: "rating",
    label: "Rating ✨",
  },
  {
    id: "biography",
    value: "bio",
    label: "Biography",
  },
  {
    id: "educAttainment",
    value: "educ-attainment",
    label: "Educational Attainment",
  },
  {
    id: "achievements",
    value: "achievements",
    label: "Achievements",
  },
  {
    id: "platformAndPolicy",
    value: "platform-policy",
    label: "Platform & Policy",
  },
];

export const faqData = {
  faqs: [
    {
      question: "What is Election PH?",
      answer:
        "Election PH is an online, unbiased survey platform where users can participate in political surveys related to upcoming elections. It is not an official voting site but serves as a community-driven platform to gather opinions on candidates.",
    },
    {
      question: "Is my vote on Election PH counted in the official elections?",
      answer:
        "No, votes submitted on Election PH are purely for survey purposes and are not counted in any official election. Our platform is designed to gather insights, not to influence or replace formal election processes.",
    },
    {
      question: "How does the survey work?",
      answer:
        "To participate, users simply select a survey, review the list of candidates, and submit their vote. Your vote helps us understand public sentiment and opinion about the candidates.",
    },
    {
      question: "Can I vote multiple times with different Gmail accounts?",
      answer:
        "We have systems in place to monitor and flag unusual voting patterns to maintain survey integrity. Any suspicious activity may result in vote removal.",
    },
    {
      question: "How can I trust that the surveys are unbiased?",
      answer:
        "Election PH takes pride in maintaining neutrality and transparency. The platform provides equal representation for all candidates, and the surveys are conducted without bias or agenda.",
    },
    {
      question: "Is Election PH affiliated with the government?",
      answer:
        "No, Election PH is an independent platform and is not affiliated with the government or COMELEC.",
    },
    {
      question: "Who can participate in the surveys?",
      answer:
        "Anyone with an interest in sharing their opinion on the candidates can participate in the surveys on Election PH. You do not need to be a registered voter to participate.",
    },
    {
      question: "Can I vote more than once in the surveys?",
      answer:
        "No, each participant can only submit one vote per survey to maintain the integrity of the data.",
    },
    {
      question: "How are the results used?",
      answer:
        "The results of our surveys are used to reflect public sentiment and may be shared for educational and analytical purposes. They are not official indicators of election outcomes.",
    },
    {
      question: "How are the candidates listed on Election PH?",
      answer:
        "Candidates are listed based on publicly available information and their official candidacy for the elections. Profiles include details such as their party affiliation, platform, and biography.",
    },
    {
      question: "Can I share my survey results?",
      answer:
        "Yes, after participating in a survey, you will have the option to share your results on social media to engage others and encourage more participation.",
    },
    {
      question: "How often are new surveys added?",
      answer:
        "Surveys are typically added as election dates approach or as new candidates announce their platforms. Check back regularly for updates.",
    },
    {
      question:
        "What if someone has multiple Gmail accounts and votes multiple times?",
      answer:
        "At Election PH, we aim to maintain the integrity of our survey results. While users can sign in with different Gmail accounts, we have measures in place to detect and prevent duplicate votes from the same individual. Additionally, we continuously monitor and improve our systems to ensure fairness and accuracy in the survey data. If any unusual voting patterns are detected, those votes may be flagged or removed.",
    },
    {
      question: "Can I recommend new features or report an issue?",
      answer:
        "Absolutely! We value your feedback. Please contact us via our contact form to suggest new features or report any issues you experience while using the site.",
    },
  ],
};

export const sideCards = [
  {
    title: "Gender",
    description:
      "Analysis of voting patterns and preferences based on gender demographics in the election.",
  },
  {
    title: "Education",
    description:
      "Breakdown of voter turnout and political leanings across different educational backgrounds.",
  },
  {
    title: "Age",
    description:
      "Examination of how age groups influence voting behavior and election outcomes.",
  },
  {
    title: "Cities",
    description:
      "Comparison of election results and voter engagement across various urban centers.",
  },
];
