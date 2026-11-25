import homeworkImage from '../assets/program-homework.webp'
import homeworkDetail from '../assets/program-homework1.webp'
import girlsImage from '../assets/program-girls-sponsorship.webp'
import girlsDetail from '../assets/program-girls-sponsorship (2).webp'
import vocationalCentreImage from '../assets/program-vocational2.webp'
import vocationalGraduationImage from '../assets/graduation.webp'
import communityGardenImage from '../assets/program-community-garden2.webp'
import communityGardenDetail from '../assets/program-comunity-garden.webp'

export type Program = {
  title: string
  slug: string
  summary: string
  images: [string, string]
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
    images: [homeworkImage, homeworkDetail],
    overview:
      'Operating since 2010, our Homework Centres help learners with special educational needs and learning difficulties remain in school. The centres operate in Michiru, Chikuli, Chigumukire, Chilangoma, and Andiseni Primary Schools. Three afternoons a week,  secondary-school volunteers trained as Peer Educators tutor identified students in standards 3,4 and 5. Teachers volunteer as Patrons.',
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
    images: [girlsImage, girlsDetail],
    overview:
      'Established in 2015, this program assists girls to remain in school who would have been forced to leave due to family pressures, early marriage or lack of school fees. Sponsors from around the world help provide students with their school requirements. Sponsorship costs US$180 per student per year. More than 55 girls have been sponsored, helping them remain in school and complete their secondary education.',
    highlights: [
      'Sponsors contribute US$180 per student per year toward school requirements.',
      'The current sponsorship cohort includes 11 girls and, in response to requests, 7 boys.',
      'Many sponsored girls have also volunteered as Peer Educators in the Homework Centre Program.',
       'A case in point is Miriam. Mwayi Trust sponsered her for two years to complete her secondary school education. During that time she volunteered as a Peer Educator. After that she attained her MSCE, and applied for and receiced a scholarship for Proffesional Cookery. After graduationg, she gained employement with a local carteering company. And has been employed in other businesses ever since.'
      
    ],
    outcomes: [
      'Girls remaining in school and completing their secondary education.',
      'Increased Self esteem and Confidence about their future.',
      'Girls receiving Vocational college scholarships for Proffesional Cookery, Tailoring, Carpentry and Housekeeping.',
    ],
    enrollSteps: [
      'Contact the Mwayi Trust team to discuss sponsoring a student.',
      'Arrange a sponsorship contribution of US$150 per year.',
      'Speak with the team about current sponsorship needs and how support is provided.',
    ],
  },
  {
    title: 'Vocational College',
    slug: 'vocational-training',
    summary:
      'Inclusive, hands-on training to build practical skills for employment.',
    images: [vocationalCentreImage, vocationalGraduationImage],
    overview:
      'This programme offers opportunities for young people from rural areas, to access competency-based vocational training regardless of their educational background. Our competency-based courses combine practical vocational training with business communication and entrepreneurship. Courses are selected with input from local communities and businesses, and availability may vary by intake. Young people with special educational needs are encouraged to apply and can take the time they need to achieve course competencies.',
    highlights: [
      'All courses provide sufficient hands on  practical training to ensure competency.',
      'Work experience and opportunities are provided through local business parteners.',
      'Fees are kept as low as possible, and scholarships are available for former Peer Educators, young people with special educational needs, and applicants from villages that contributed to the Centre.',
      'Employers are now contacting the college for suitable employees.',
      'Over 50 graaduates are now employeed by recognised local businesses e.g hotels, cafes, building constructors, furniture makers etc.',
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
    images: [communityGardenImage, communityGardenDetail],
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
]
