// Frontend/Mobile App Onboarding Tour Steps

export const mobileTourSteps = [
  {
    target: '[data-tour="home"]',
    title: 'Welcome to Sycamore Church App! 🎉',
    content: 'Your spiritual journey begins here. Access sermons, events, devotionals, and connect with your church family.',
    placement: 'bottom' as const
  },
  {
    target: '[data-tour="navigation"]',
    title: 'Easy Navigation',
    content: 'Tap the menu to explore all features: Events, Devotionals, Giving, Prayer Requests, and more.',
    placement: 'top' as const
  },
  {
    target: '[data-tour="profile"]',
    title: 'Your Profile',
    content: 'Manage your account, update preferences, and track your spiritual journey.',
    placement: 'left' as const
  }
]

// Home Page Tour
export const homePageTourSteps = [
  {
    target: '[data-tour="hero-section"]',
    title: 'Stay Updated',
    content: 'View the latest announcements, upcoming services, and featured content from your church.',
    placement: 'bottom' as const
  },
  {
    target: '[data-tour="quick-access"]',
    title: 'Quick Access',
    content: 'Tap these cards to quickly access events, devotionals, giving, and other features.',
    placement: 'bottom' as const
  },
  {
    target: '[data-tour="upcoming-events"]',
    title: 'Upcoming Events',
    content: 'See what\'s happening at church. Register for events and add them to your calendar.',
    placement: 'bottom' as const
  }
]

// Events Page Tour
export const eventsPageTourSteps = [
  {
    target: '[data-tour="events-list"]',
    title: 'Church Events',
    content: 'Browse all upcoming services, conferences, and special programs.',
    placement: 'top' as const
  },
  {
    target: '[data-tour="event-card"]',
    title: 'Event Details',
    content: 'Tap any event to see full details, register, and get directions.',
    placement: 'bottom' as const
  },
  {
    target: '[data-tour="event-register"]',
    title: 'Quick Registration',
    content: 'Register for events with one tap and receive reminders before the event starts.',
    placement: 'left' as const
  }
]

// Devotionals Page Tour
export const devotionalsPageTourSteps = [
  {
    target: '[data-tour="todays-devotional"]',
    title: 'Daily Bread',
    content: 'Start your day with today\'s devotional - fresh spiritual content every morning.',
    placement: 'bottom' as const
  },
  {
    target: '[data-tour="devotional-content"]',
    title: 'Rich Content',
    content: 'Read scripture, reflection, and discussion questions to deepen your faith.',
    placement: 'bottom' as const
  },
  {
    target: '[data-tour="devotional-actions"]',
    title: 'Engage & Share',
    content: 'Like, comment, and share devotionals with your church community.',
    placement: 'top' as const
  },
  {
    target: '[data-tour="devotional-history"]',
    title: 'Your Journey',
    content: 'Track your reading streak and revisit past devotionals anytime.',
    placement: 'top' as const
  }
]

// Giving Page Tour
export const givingPageTourSteps = [
  {
    target: '[data-tour="giving-methods"]',
    title: 'Multiple Giving Options',
    content: 'Give tithes and offerings through mobile money, bank transfer, or card payment.',
    placement: 'bottom' as const
  },
  {
    target: '[data-tour="giving-categories"]',
    title: 'Giving Categories',
    content: 'Choose what you\'re giving towards: Tithes, Offerings, Building Fund, Missions, etc.',
    placement: 'bottom' as const
  },
  {
    target: '[data-tour="giving-history"]',
    title: 'Transaction History',
    content: 'View all your donations and download receipts for tax purposes.',
    placement: 'top' as const
  },
  {
    target: '[data-tour="recurring-giving"]',
    title: 'Set It & Forget It',
    content: 'Set up recurring donations to give automatically every week or month.',
    placement: 'left' as const
  }
]

// Prayer Requests Tour
export const prayerPageTourSteps = [
  {
    target: '[data-tour="submit-request"]',
    title: 'Share Your Needs',
    content: 'Submit personal or general prayer requests for the church to pray about.',
    placement: 'bottom' as const
  },
  {
    target: '[data-tour="prayer-list"]',
    title: 'Community Prayer',
    content: 'See prayer requests from other members and pray with them.',
    placement: 'bottom' as const
  },
  {
    target: '[data-tour="pray-button"]',
    title: 'Pray Together',
    content: 'Tap "I\'m Praying" to let others know you\'re interceding for them.',
    placement: 'left' as const
  },
  {
    target: '[data-tour="testimonies"]',
    title: 'Answered Prayers',
    content: 'Read testimonies of answered prayers and share your own praise reports.',
    placement: 'top' as const
  }
]

// Communities Tour
export const communitiesPageTourSteps = [
  {
    target: '[data-tour="communities-list"]',
    title: 'Find Your Community',
    content: 'Browse life groups, Bible studies, and ministry teams to join.',
    placement: 'bottom' as const
  },
  {
    target: '[data-tour="join-community"]',
    title: 'Get Connected',
    content: 'Join communities that match your interests and grow together in faith.',
    placement: 'bottom' as const
  },
  {
    target: '[data-tour="community-chat"]',
    title: 'Stay in Touch',
    content: 'Message other members, share updates, and encourage one another.',
    placement: 'left' as const
  }
]

// Profile Tour
export const profilePageTourSteps = [
  {
    target: '[data-tour="profile-info"]',
    title: 'Your Information',
    content: 'Keep your contact details and preferences up to date.',
    placement: 'bottom' as const
  },
  {
    target: '[data-tour="spiritual-stats"]',
    title: 'Your Spiritual Journey',
    content: 'Track your devotional reading streak, event attendance, and giving history.',
    placement: 'bottom' as const
  },
  {
    target: '[data-tour="notifications"]',
    title: 'Stay Informed',
    content: 'Manage notification preferences to stay updated on church activities.',
    placement: 'top' as const
  }
]

// Media/Sermons Tour
export const mediaPageTourSteps = [
  {
    target: '[data-tour="sermon-library"]',
    title: 'Sermon Archive',
    content: 'Access all past sermons - audio, video, and notes.',
    placement: 'bottom' as const
  },
  {
    target: '[data-tour="sermon-search"]',
    title: 'Find Messages',
    content: 'Search by topic, speaker, scripture, or date to find specific messages.',
    placement: 'bottom' as const
  },
  {
    target: '[data-tour="download"]',
    title: 'Offline Access',
    content: 'Download sermons to listen offline when you don\'t have internet.',
    placement: 'left' as const
  },
  {
    target: '[data-tour="sermon-notes"]',
    title: 'Take Notes',
    content: 'Add personal notes and highlights while listening to sermons.',
    placement: 'top' as const
  }
]
