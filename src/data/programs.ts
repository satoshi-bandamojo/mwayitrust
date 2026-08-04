import homeworkImage from '../assets/program-homework.jpg'
import homeworkDetail from '../assets/program-homework1.jpg'
import girlsImage from '../assets/program-girls-sponsorship.jpg'
import girlsDetail from '../assets/program-homework2.jpg'
import vocationalImage from '../assets/program-vocational.jpg'
import vocationalDetail from '../assets/program-vocational1.jpg'
import communityGardenImage from '../assets/program-community-garden2.jpg'
import communityGardenDetail from '../assets/program-community-garden2.jpg'

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
      'Our Homework Centre provides a safe, supportive space for young learners to receive tutoring, access school supplies, and build strong study habits. The program helps students catch up, stay engaged, and improve their confidence in the classroom.',
    highlights: ['Individualized tutoring support', 'Structured after-school study', 'Mentoring and school supplies'],
    outcomes: ['Improved grades', 'Higher attendance', 'Greater confidence in learning'],
    enrollSteps: [
      'Complete the learner registration form online or at the centre.',
      'Attend a short intake meeting with the program team.',
      'Begin classes and receive ongoing mentor support.',
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
      'This sponsorship program supports girls from vulnerable homes by covering school fees, uniforms, books, and mentorship. We work closely with families and schools to ensure each girl receives the encouragement and resources she needs to continue her studies.',
    highlights: ['School fee support', 'Mentorship circles', 'Family and school follow-up'],
    outcomes: ['Higher retention', 'Stronger study outcomes', 'Improved future choices'],
    enrollSteps: [
      'Submit an application on behalf of a girl student.',
      'Provide basic school and household information.',
      'Meet with the sponsorship coordinator for the first review.',
    ],
  },
  {
    title: 'Vocational Training Centre',
    slug: 'vocational-training',
    summary:
      'Provides practical skills in cookery, tailoring, carpentry, and housekeeping to prepare youth for work and entrepreneurship.',
    image: vocationalImage,
    detailImage: vocationalDetail,
    overview:
      'Our Vocational Training Centre equips young people with hands-on technical skills, workplace readiness, and small-business know-how. The programme combines practical workshops, mentorship, and placement support to help graduates move into work or start their own enterprises.',
    highlights: ['Hands-on trade training', 'Career guidance', 'Enterprise mentoring'],
    outcomes: ['Job-ready skills', 'Improved income potential', 'Stronger community resilience'],
    enrollSteps: [
      'Review the training schedule and available trades.',
      'Submit the vocational intake form.',
      'Attend orientation and begin practical training.',
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
      'The Community Garden Programme creates opportunities for young women to gain practical agricultural skills while improving their livelihoods. Participants work in the garden each day, receiving hands-on training, meals, maize, and fresh vegetables. Produce from the garden supports the Professional Cookery course, while surplus vegetables are sold locally to create additional income.',
    highlights: [
      'Fresh vegetables and food support',
      'Practical farming skills',
      'Vocational scholarships and education access',
    ],
    outcomes: [
      'Young women gain practical agricultural training.',
      'Garden produce supports learning and local income generation.',
      'Scholarship pathways open access to vocational education and independence.',
    ],
    enrollSteps: [
      'Contact the Mwayi Trust team to express interest in the garden programme.',
      'Attend an intake conversation and understand the daily garden routine.',
      'Begin practical farming training and become eligible for scholarship opportunities.',
    ],
  },
]
