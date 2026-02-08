
import { Church, Sermon, Message, SmallGroup } from './types';

export const MOCK_CHURCHES: Church[] = [
  {
    id: 'grace-community',
    name: 'Grace Community',
    logo: 'https://picsum.photos/seed/grace/100/100',
    color: '#8B9D83',
    lastSermon: 'The Weight of Glory'
  },
  {
    id: 'st-jude',
    name: 'St. Jude Cathedral',
    logo: 'https://picsum.photos/seed/stjude/100/100',
    color: '#C8956D',
    lastSermon: 'Walking on Water'
  },
  {
    id: 'city-light',
    name: 'City Light Church',
    logo: 'https://picsum.photos/seed/citylight/100/100',
    color: '#6D89C8',
    lastSermon: 'A City on a Hill'
  }
];

export const VICTORY_CHURCHES: Church[] = [
  {
    id: 'v-decatur',
    name: 'Victory Decatur',
    logo: 'https://picsum.photos/seed/decatur/100/100',
    color: '#8B9D83',
    lastSermon: 'Pastor Dennis Rouse',
    groupCount: 3
  },
  {
    id: 'v-duluth',
    name: 'Victory Duluth',
    logo: 'https://picsum.photos/seed/duluth/100/100',
    color: '#C8956D',
    lastSermon: 'Pastor Greg Oliver',
    groupCount: 3
  },
  {
    id: 'v-stockbridge',
    name: 'Victory Stockbridge',
    logo: 'https://picsum.photos/seed/stockbridge/100/100',
    color: '#6D89C8',
    lastSermon: 'Pastor Joel Hodge',
    groupCount: 0
  },
  {
    id: 'v-mcdonough',
    name: 'Victory McDonough',
    logo: 'https://picsum.photos/seed/mcdonough/100/100',
    color: '#D4AF37',
    lastSermon: 'Pastor Dion Hodge',
    groupCount: 0
  },
  {
    id: 'v-college-park',
    name: 'Victory College Park',
    logo: 'https://picsum.photos/seed/collegepark/100/100',
    color: '#9B6DC8',
    lastSermon: 'Pastor Shawn Johnson',
    groupCount: 0
  }
];

export const SMALL_GROUPS_CATALOG: SmallGroup[] = [
  {
    id: 'g-dec-1',
    name: 'Young Professionals (25-35)',
    churchId: 'v-decatur',
    meetingTime: 'Wednesdays, 7pm',
    location: 'Decatur, GA',
    focus: ['Career', 'Relationships', 'Faith'],
    members: 12,
    demographic: 'Young Professionals'
  },
  {
    id: 'g-dec-2',
    name: 'Men\'s Bible Study',
    churchId: 'v-decatur',
    meetingTime: 'Saturday mornings, 8am',
    location: 'Coffee shop, Decatur',
    focus: ['Accountability', 'Scripture'],
    members: 8
  },
  {
    id: 'g-dec-3',
    name: 'Marriage & Parenting',
    churchId: 'v-decatur',
    meetingTime: 'Sundays, 5pm',
    location: 'Church campus',
    focus: ['Family', 'Relationships'],
    members: 6,
    demographic: 'Couples'
  },
  {
    id: 'g-dul-1',
    name: 'College & Career',
    churchId: 'v-duluth',
    meetingTime: 'Thursdays, 6:30pm',
    location: 'Duluth, GA',
    focus: ['Faith transitions', 'Purpose'],
    members: 15
  },
  {
    id: 'g-dul-2',
    name: 'Women\'s Study',
    churchId: 'v-duluth',
    meetingTime: 'Tuesday mornings, 10am',
    location: 'Host home',
    focus: ['Prayer', 'Scripture', 'Community'],
    members: 10
  },
  {
    id: 'g-dul-3',
    name: 'Grief & Loss Support',
    churchId: 'v-duluth',
    meetingTime: 'Mondays, 7pm',
    location: 'Church campus',
    focus: ['Healing', 'Support'],
    members: 7
  }
];

export const MOCK_SERMONS: Sermon[] = [
  {
    id: 's1',
    title: 'The Weight of Glory',
    date: 'Oct 24, 2023',
    speaker: 'Rev. Sarah Jenkins',
    churchName: 'Grace Community',
    summary: 'An exploration of C.S. Lewis\'s themes on eternal significance and human worth.'
  },
  {
    id: 's2',
    title: 'Living in the Paradox',
    date: 'Nov 12, 2023',
    speaker: 'Dr. Michael Chen',
    churchName: 'Grace Community',
    summary: 'Discussing the tension between faith and doubt in the modern age.'
  }
];

export const INITIAL_MESSAGES: Message[] = [
  {
    id: '1',
    role: 'user',
    content: "I've been thinking about the sermon from last Sunday at Grace Community. How does the 'Weight of Glory' concept apply to our everyday interactions with people we don't necessarily like?",
    timestamp: new Date(Date.now() - 3600000),
    churchId: 'grace-community'
  },
  {
    id: '2',
    role: 'assistant',
    content: "That's a profound question. In 'The Weight of Glory', the core idea is that there are no 'ordinary' people—every person you meet is a 'soul that might be a god or goddess'. \n\nRev. Sarah Jenkins emphasized this in the sermon by suggesting that when we interact with someone difficult, we should try to see them through the lens of their eternal potential. It shifts the focus from their current flaws to their ultimate destination.",
    timestamp: new Date(Date.now() - 3500000),
    citations: [MOCK_SERMONS[0]]
  },
  {
    id: '3',
    role: 'user',
    content: "That makes sense. Did she mention any specific verses to support that?",
    timestamp: new Date(Date.now() - 3400000)
  }
];
