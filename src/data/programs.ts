import homeworkImage from '../assets/program-homework.webp'
import homeworkDetail from '../assets/program-homework1.webp'
import girlsImage from '../assets/program-girls-sponsorship.webp'
import girlsDetail from '../assets/program-homework2.webp'
import vocationalImage from '../assets/program-vocational.webp'
import vocationalDetail from '../assets/program-vocational1.webp'
import communityGardenImage from '../assets/program-community-garden2.webp'
import communityGardenDetail from '../assets/program-community-garden2.webp'

export type Program = {
  title: string
  slug: string
  summary: string
  image: string
  detailImage: string
  overview: string
  highlights: string[]
  outcomes: string[]
  enrollSteps: string[]
}

export const programs: Program[] = [
  {
    title: 'Homework Centre Program',
    slug: 'homework-centre',
    summary:
      'Supports vulnerable learners with tutoring, mentoring, and after-school learning in nearby primary schools.',
    image: homeworkImage,
    detailImage: homeworkDetail,
    overview:
      'Operating since 2010, our Homework Centres help learners with special educational needs and learning difficulties remain in school. The centres operate in Michiru, Chikuli, Chigumukire, Chilangoma, and Andiseni Primary Schools. Three afternoons each week, trained secondary-school volunteers tutor learners in Standards 3, 4, and 5, with participating-school teachers volunteering as Patrons to supervise.',
    highlights: [
      'More than 200 learners receive support each week, and over 1,000 learners have benefited since the program began.',
      'Each year, 50–75 young people in Forms 1 and 3 from four local secondary schools train as Peer Educators in a 3–5 day workshop.',
      'Approximately 10 volunteer teachers from participating schools supervise the centres as Patrons.',
    ],
    outcomes: [
      'Learners with learning difficulties receive regular tutoring and support to stay in school.',
      'Since 2012, more than seven Peer Educators have received Open and Distance Learning (ODL) teaching scholarships.',
      'More than 20 former Peer Educators have received scholarships to the Vocational College and completed a vocational course.',
    ],
    enrollSteps: [
      'Contact the Mwayi Trust team to ask about learner support or volunteering.',
      'Speak with the team about the participating schools and Peer Educator training.',
      'Coordinate next steps with the program team and the relevant school.',
    ],
  },
  {
    title: 'Girls Secondary School Sponsorship',
    slug: 'girls-sponsorship',
    summary:
      'Helps girls stay in school through fee support, mentorship, and life-skills coaching to reduce dropout risk.',
    image: girlsImage,
    detailImage: girlsDetail,
    overview:
      'Established in 2015, this program responds to girls leaving school because of family pressure, pregnancy, or early marriage—barriers that can limit access to meaningful employment. Sponsors from around the world help provide students with their school requirements. Sponsorship costs US$150 per student per year. More than 55 girls have been sponsored, helping them remain in school and complete secondary education.',
    highlights: [
      'Sponsors contribute US$150 per student per year toward school requirements.',
      'The current sponsorship cohort includes 11 girls and, in response to requests, 7 boys.',
      'Many sponsored girls have also volunteered as Peer Educators in the Homework Centre Program.',
    ],
    outcomes: [
      'More than 55 girls have received support to stay in school and complete secondary education.',
      'Twelve girls have received Vocational College scholarships and completed Professional Cookery or Tailoring courses.',
      'Several graduates are employed full-time, including in their own businesses, cafes, and lodges around Blantyre; one is working in South Africa.',
    ],
    enrollSteps: [
      'Contact the Mwayi Trust team to discuss sponsoring a student.',
      'Arrange a sponsorship contribution of US$150 per student per year.',
      'Speak with the team about current sponsorship needs and how support is provided.',
    ],
  },
  {
    title: 'Vocational Training Centre',
    slug: 'vocational-training',
    summary:
      'Inclusive, hands-on training to build practical skills for employment and self-employment.',
    image: vocationalImage,
    detailImage: vocationalDetail,
    overview:
      'Our competency-based courses combine practical vocational training with business communication, entrepreneurship, and life skills. Courses are selected with input from local communities and businesses, and availability may vary by intake. Young people with special educational needs are encouraged to apply and can take the time they need to achieve course competencies.',
    highlights: [
      'Training pathways include Professional Cookery, Tailoring, Housekeeping, and Carpentry.',
      'Housekeeping offers practical training in a model hotel room with an ensuite and is designed for girls with learning difficulties and women who did not complete or attend secondary school.',
      'Fees are kept as low as possible, and scholarships may be available for former Peer Educators, young people with special educational needs, and applicants from villages that contributed to the Centre.',
    ],
    outcomes: [
      'Build practical skills and business know-how for employment or self-employment.',
      'Graduates have found work with local hospitality businesses, while others have started small businesses.',
      'Tailoring graduates can use the Centre’s sewing workspace free of charge to develop their own businesses.',
    ],
    enrollSteps: [
      'Ask the Mwayi Trust team which courses are available in the next intake.',
      'Discuss course requirements, fees, and any scholarship eligibility.',
      'Contact the team for information on how to apply.',
    ],
  },
  {
    title: 'Community Garden',
    slug: 'community-garden',
    summary:
      'Growing food, skills, and opportunities for the community through hands-on farming and scholarship pathways.',
    image: communityGardenImage,
    detailImage: communityGardenDetail,
    overview:
      'Shoprite sponsored the establishment of the on-site vegetable garden and provided its initial resources. The garden has supported six local young women over time; three currently work in it each day. The women had not completed secondary school and receive a small allowance, maize, meals, and vegetables from the garden. They learn current gardening and vegetable-production techniques while maintaining the garden.',
    highlights: [
      'Garden produce is used in the Professional Cookery course and shared with the gardeners.',
      'Produce not used for cookery or taken home is sold locally or to Shoprite.',
      'Each year, one or two gardeners receive a scholarship for a course at the Vocational College.',
    ],
    outcomes: [
      'Young women gain practical experience in gardening and vegetable production.',
      'Daily work provides an allowance and food support, including maize, meals, and vegetables.',
      'Scholarships create a pathway from garden work into vocational training.',
    ],
    enrollSteps: [
      'Contact the Mwayi Trust team to learn about the garden and current opportunities.',
      'Discuss participation, the daily garden routine, and available support with the team.',
      'Ask about the Vocational College scholarship pathway for gardeners.',
    ],
  },
  {
    title: 'Speak English Chileka',
    slug: 'speak-english-chileka',
    summary:
      'An English learning program in Chileka, planned to restart in 2027.',
    image: homeworkImage,
    detailImage: homeworkDetail,
    overview:
      'Speak English Chileka was introduced to respond to local learning needs and showed positive results. The program is currently paused due to limited funding, with a restart planned for 2027.',
    highlights: [
      'A community-based English learning opportunity in Chileka.',
      'The program is planned to restart in 2027.',
    ],
    outcomes: [
      'An opportunity to develop English communication skills.',
    ],
    enrollSteps: [
      'The program is planned to restart in 2027.',
      'Contact Mwayi Trust to ask about the restart and future enrollment.',
    ],
  },
]
