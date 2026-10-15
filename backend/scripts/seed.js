import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB, disconnectDB } from '../src/config/db.js';
import { hashPassword } from '../src/utils/password.js';
import {
  User,
  ClientProfile,
  VAProfile,
  Skill,
  ClientRequirement,
  SkillAssessment,
  AssessmentQuestion,
  AssessmentResult,
  Verification,
  TrialTask,
  TrialSubmission,
  Shortlist,
  HiringRequest,
  Engagement,
  Task,
  Performance,
  Review,
  Notification,
  Conversation,
  Message,
  Report,
  AdminAction
} from '../src/models/index.js';
import { SKILLS } from '../src/data/skills.seed.js';

async function reset() {
  const collections = await mongoose.connection.db.collections();
  for (const c of collections) {
    await c.deleteMany({});
  }
  console.log('Cleared all collections');
}

async function seedSkills() {
  const docs = await Skill.insertMany(SKILLS);
  console.log(`Inserted ${docs.length} skills`);
  return docs;
}

async function seedUsers() {
  const passwordHash = await hashPassword('Password123');

  const admin = await User.create({
    firstName: 'Admin',
    lastName: 'Root',
    email: 'admin@ecomva-verify.local',
    passwordHash,
    role: 'admin',
    status: 'active',
    emailVerified: true
  });

  const clientUser = await User.create({
    firstName: 'Olivia',
    lastName: 'Chen',
    email: 'client@ecomva-verify.local',
    passwordHash,
    role: 'client',
    status: 'active',
    emailVerified: true
  });

  const vaUser = await User.create({
    firstName: 'Mika',
    lastName: 'Santos',
    email: 'va@ecomva-verify.local',
    passwordHash,
    role: 'va',
    status: 'active',
    emailVerified: true
  });

  const extraVAUsers = [
    { firstName: 'Rafael', lastName: 'Garcia', email: 'rafael.va@ecomva-verify.local', country: 'Philippines', tz: 'Asia/Manila' },
    { firstName: 'Aisyah', lastName: 'Putri', email: 'aisyah.va@ecomva-verify.local', country: 'Indonesia', tz: 'Asia/Jakarta' },
    { firstName: 'Nguyen', lastName: 'Lan', email: 'lan.va@ecomva-verify.local', country: 'Vietnam', tz: 'Asia/Ho_Chi_Minh' },
    { firstName: 'Siriporn', lastName: 'Chai', email: 'siriporn.va@ecomva-verify.local', country: 'Thailand', tz: 'Asia/Bangkok' }
  ];

  const extraVAs = [];
  for (const u of extraVAUsers) {
    const created = await User.create({
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      passwordHash,
      role: 'va',
      status: 'active',
      emailVerified: true
    });
    extraVAs.push({ user: created, country: u.country, tz: u.tz });
  }

  return { admin, clientUser, vaUser, extraVAs };
}

async function seedProfiles(users, skills) {
  const clientProfile = await ClientProfile.create({
    user: users.clientUser._id,
    companyName: 'Northwind Commerce LLC',
    website: 'https://northwind.example.com',
    platform: 'amazon',
    country: 'United States',
    timezone: 'America/New_York',
    contactEmail: 'ops@northwind.example.com',
    about: 'Amazon FBA store selling home & kitchen goods.'
  });

  const skillByName = Object.fromEntries(skills.map((s) => [s.name, s]));

  const vaProfile = await VAProfile.create({
    user: users.vaUser._id,
    headline: 'Amazon listing specialist with 4+ years',
    bio: 'I have managed listings, PPC and inventory for 3 Amazon brands across US and EU marketplaces.',
    country: 'Philippines',
    timezone: 'Asia/Manila',
    languages: ['English', 'Filipino'],
    hourlyRate: 8,
    yearsExperience: 4,
    englishLevel: 'fluent',
    availability: 'full_time',
    verificationStatus: 'verified',
    verifiedAt: new Date(),
    skills: [
      { skill: skillByName['Amazon Product Listing']._id, name: 'Amazon Product Listing', platform: 'amazon', yearsExperience: 4, level: 'expert', score: 92 },
      { skill: skillByName['Amazon PPC / Sponsored Ads']._id, name: 'Amazon PPC / Sponsored Ads', platform: 'amazon', yearsExperience: 3, level: 'advanced', score: 88 },
      { skill: skillByName['Inventory Management']._id, name: 'Inventory Management', platform: 'amazon', yearsExperience: 3, level: 'advanced', score: 85 }
    ]
  });

  const extraProfiles = [];
  const vaBlueprint = [
    { headline: 'Shopify store manager & customer support', country: 'Philippines', tz: 'Asia/Manila', rate: 7, years: 3, eng: 'fluent', skills: ['Shopify Store Management', 'Customer Support', 'Order & Return Handling'] },
    { headline: 'Amazon PPC & product research', country: 'Indonesia', tz: 'Asia/Jakarta', rate: 9, years: 5, eng: 'professional', skills: ['Amazon PPC / Sponsored Ads', 'Product Research', 'Amazon Product Listing'] },
    { headline: 'Shopify store setup & graphic design', country: 'Vietnam', tz: 'Asia/Ho_Chi_Minh', rate: 8, years: 4, eng: 'professional', skills: ['Shopify Store Setup', 'Graphic Design (E-commerce)'] },
    { headline: 'Customer support & returns specialist', country: 'Thailand', tz: 'Asia/Bangkok', rate: 6, years: 2, eng: 'conversational', skills: ['Customer Support', 'Order & Return Handling'] }
  ];

  for (let i = 0; i < users.extraVAs.length; i++) {
    const u = users.extraVAs[i];
    const bp = vaBlueprint[i];
    const vaSkills = bp.skills.map((name, idx) => ({
      skill: skillByName[name]._id,
      name,
      platform: skillByName[name].platform,
      yearsExperience: Math.max(1, bp.years - idx),
      level: idx === 0 ? 'expert' : 'advanced',
      score: 80 + ((i + idx) % 15)
    }));
    const created = await VAProfile.create({
      user: u.user._id,
      headline: bp.headline,
      bio: `${bp.headline} with ${bp.years} years of experience.`,
      country: u.country,
      timezone: u.tz,
      languages: ['English'],
      hourlyRate: bp.rate,
      yearsExperience: bp.years,
      englishLevel: bp.eng,
      availability: 'full_time',
      verificationStatus: i < 2 ? 'verified' : 'unverified',
      verifiedAt: i < 2 ? new Date() : null,
      skills: vaSkills,
      assessmentAverage: 78 + i * 3,
      practicalAverage: i < 2 ? 82 + i * 2 : null,
      performance: {
        overallScore: 75 + i * 4,
        tasksCompleted: 5 + i * 2,
        taskCompletionRate: 88 + i,
        onTimeRate: 85 + i * 2,
        accuracy: 87 + i,
        responsiveness: 90,
        clientRating: 4.2 + i * 0.1
      }
    });
    extraProfiles.push(created);
  }

  return { clientProfile, vaProfile, extraProfiles };
}

async function seedAssessments(skills, admin) {
  const skillByName = Object.fromEntries(skills.map((s) => [s.name, s]));
  const templates = [
    {
      title: 'Amazon Product Listing Fundamentals',
      skill: skillByName['Amazon Product Listing']._id,
      platform: 'amazon',
      difficulty: 'medium',
      durationMinutes: 30,
      passingScore: 70,
      questions: [
        {
          question: 'What is the recommended character limit for an Amazon product title?',
          type: 'single',
          options: ['80', '150', '200', '500'],
          correctAnswer: '200',
          explanation: 'Amazon allows up to 200 characters in product titles.'
        },
        {
          question: 'Which section is used to store backend search keywords that are not visible to customers?',
          type: 'single',
          options: ['Bullets', 'Description', 'Search Terms', 'A+ Content'],
          correctAnswer: 'Search Terms',
          explanation: 'Search Terms are backend keywords.'
        },
        {
          question: 'What does A+ Content allow sellers to add?',
          type: 'single',
          options: ['Paid ads', 'Enhanced images and comparison charts', 'Backend keywords', 'Refund policies'],
          correctAnswer: 'Enhanced images and comparison charts',
          explanation: 'A+ Content is enhanced branded content.'
        },
        {
          question: 'Is mentioning a competitor brand in your listing allowed?',
          type: 'single',
          options: ['Yes', 'No', 'Only in Search Terms', 'Only in bullets'],
          correctAnswer: 'No',
          explanation: 'Competitor brand mentions violate Amazon policy.'
        },
        {
          question: 'Which bullet format is most effective?',
          type: 'single',
          options: ['Long paragraphs', 'All caps benefit + supporting detail', 'Unrelated jokes', 'Repeated keywords'],
          correctAnswer: 'All caps benefit + supporting detail',
          explanation: 'Benefit-led, scannable bullets perform best.'
        }
      ]
    },
    {
      title: 'Shopify Store Management Basics',
      skill: skillByName['Shopify Store Management']._id,
      platform: 'shopify',
      difficulty: 'easy',
      durationMinutes: 20,
      passingScore: 70,
      questions: [
        {
          question: 'Where do you configure shipping rates in Shopify?',
          type: 'single',
          options: ['Products', 'Settings → Shipping and delivery', 'Orders', 'Apps'],
          correctAnswer: 'Settings → Shipping and delivery',
          explanation: 'Shipping is configured in Settings.'
        },
        {
          question: 'What are collections used for?',
          type: 'single',
          options: ['Grouping products', 'Storing customer emails', 'Managing staff', 'Handling refunds'],
          correctAnswer: 'Grouping products',
          explanation: 'Collections group related products.'
        },
        {
          question: 'Which file controls the appearance of a Shopify theme?',
          type: 'single',
          options: ['settings.json', 'config.yml', 'theme.liquid', 'products.csv'],
          correctAnswer: 'theme.liquid',
          explanation: 'theme.liquid is the base layout for a Shopify theme.'
        },
        {
          question: 'Can Shopify sell digital products?',
          type: 'single',
          options: ['Yes', 'No', 'Only with a paid app', 'Only physical'],
          correctAnswer: 'Yes',
          explanation: 'Shopify supports digital product sales.'
        }
      ]
    },
    {
      title: 'Customer Support for E-commerce',
      skill: skillByName['Customer Support']._id,
      platform: 'both',
      difficulty: 'medium',
      durationMinutes: 30,
      passingScore: 70,
      questions: [
        {
          question: 'What is the most important tone when responding to an upset customer?',
          type: 'single',
          options: ['Defensive', 'Empathetic and solution-oriented', 'Formal and distant', 'Brief and blunt'],
          correctAnswer: 'Empathetic and solution-oriented',
          explanation: 'Empathy plus a clear solution resolves most complaints.'
        },
        {
          question: 'What is an SLA?',
          type: 'single',
          options: ['Service Level Agreement', 'Standard Listing Assessment', 'Seller Liability Account', 'Store Location Address'],
          correctAnswer: 'Service Level Agreement',
          explanation: 'SLA = Service Level Agreement.'
        },
        {
          question: 'When should you escalate a customer issue?',
          type: 'single',
          options: ['Never', 'When it exceeds your authority or policy', 'After 5 minutes', 'Only if the customer asks'],
          correctAnswer: 'When it exceeds your authority or policy',
          explanation: 'Escalate when outside your scope.'
        },
        {
          question: 'Which is a good first step when a customer claims an order is missing?',
          type: 'single',
          options: ['Refund immediately', 'Confirm the order and tracking', 'Blame the courier', 'Ignore it'],
          correctAnswer: 'Confirm the order and tracking',
          explanation: 'Verify the order and tracking first.'
        }
      ]
    },
    {
      title: 'Inventory Management Essentials',
      skill: skillByName['Inventory Management']._id,
      platform: 'both',
      difficulty: 'medium',
      durationMinutes: 25,
      passingScore: 70,
      questions: [
        {
          question: 'What does a reorder point define?',
          type: 'single',
          options: ['The stock level that triggers a new order', 'A discount rule', 'A shipping method', 'A tax setting'],
          correctAnswer: 'The stock level that triggers a new order',
          explanation: 'Reorder point triggers replenishment.'
        },
        {
          question: 'What is FBA?',
          type: 'single',
          options: ['Fulfillment by Amazon', 'Fast Buyer Approval', 'Fees by Amazon', 'Final Buy Account'],
          correctAnswer: 'Fulfillment by Amazon',
          explanation: 'FBA = Fulfillment by Amazon.'
        },
        {
          question: 'Why is inventory reconciliation important?',
          type: 'single',
          options: ['To find stock mismatches and prevent stockouts', 'To increase ad spend', 'To change refunds', 'To pick a theme'],
          correctAnswer: 'To find stock mismatches and prevent stockouts',
          explanation: 'Reconciliation finds discrepancies.'
        },
        {
          question: 'What is a stockout?',
          type: 'single',
          options: ['Running out of sellable inventory', 'A discount event', 'A type of return', 'A lost shipment'],
          correctAnswer: 'Running out of sellable inventory',
          explanation: 'Stockout = no inventory to sell.'
        }
      ]
    },
    {
      title: 'Order & Return Handling',
      skill: skillByName['Order & Return Handling']._id,
      platform: 'both',
      difficulty: 'easy',
      durationMinutes: 20,
      passingScore: 70,
      questions: [
        {
          question: 'What is an A-to-Z claim on Amazon?',
          type: 'single',
          options: ['A buyer guarantee claim', 'A listing tool', 'An advertising unit', 'A shipping class'],
          correctAnswer: 'A buyer guarantee claim',
          explanation: 'A-to-Z is the Amazon buyer guarantee.'
        },
        {
          question: 'What is a chargeback?',
          type: 'single',
          options: ['A reversal of a credit card payment by the bank', 'A refund issued by the seller', 'A shipping adjustment', 'A listing change'],
          correctAnswer: 'A reversal of a credit card payment by the bank',
          explanation: 'Chargebacks are bank-driven reversals.'
        },
        {
          question: 'What is a good practice for handling returns?',
          type: 'single',
          options: ['Ignore them', 'Document reason, restock, and track patterns', 'Blame the customer', 'Always deny'],
          correctAnswer: 'Document reason, restock, and track patterns',
          explanation: 'Documenting and tracking improves operations.'
        },
        {
          question: 'Where can an Amazon seller see their return rate?',
          type: 'single',
          options: ['Seller Central → Reports', 'Shopify admin', 'Google Analytics', 'Bank statement'],
          correctAnswer: 'Seller Central → Reports',
          explanation: 'Return rate is in Seller Central reports.'
        }
      ]
    }
  ];

  const createdAssessments = [];
  for (const t of templates) {
    const assessment = await SkillAssessment.create({
      title: t.title,
      description: `Assessment covering ${t.title}.`,
      skill: t.skill,
      platform: t.platform,
      difficulty: t.difficulty,
      durationMinutes: t.durationMinutes,
      passingScore: t.passingScore,
      active: true,
      createdBy: admin._id
    });
    const questions = t.questions.map((q, idx) => ({
      assessment: assessment._id,
      question: q.question,
      type: q.type,
      options: q.options,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation || '',
      points: 1,
      order: idx
    }));
    await AssessmentQuestion.insertMany(questions);
    createdAssessments.push(assessment);
  }
  return createdAssessments;
}

async function seedAssessmentResults(vaProfiles, assessments) {
  const results = [];
  for (const va of vaProfiles) {
    for (const a of assessments.slice(0, 3)) {
      const score = 75 + Math.floor(Math.random() * 20);
      results.push({
        assessment: a._id,
        va: va._id,
        user: va.user,
        answers: [],
        score,
        passed: score >= a.passingScore
      });
    }
  }
  await AssessmentResult.insertMany(results);
}

async function seedWorkflow(clientProfile, clientUser, vaProfile, extraProfiles, assessments) {
  // verification record for main VA
  await Verification.create({
    va: vaProfile._id,
    user: vaProfile.user,
    status: 'verified',
    reason: 'All requirements met'
  });

  // requirement
  const requirement = await ClientRequirement.create({
    client: clientProfile._id,
    user: clientUser._id,
    title: 'Amazon listing specialist for 50 SKUs',
    description:
      'We need a specialist to rewrite 50 listings (titles, bullets, description, backend keywords) for our home & kitchen catalog. Deliverables include an updated CSV and screenshots of 5 improved listings.',
    platform: 'amazon',
    requiredSkills: [
      (await Skill.findOne({ slug: 'amazon-product-listing' }))._id,
      (await Skill.findOne({ slug: 'amazon-ppc' }))._id
    ],
    englishLevel: 'fluent',
    timezone: 'Asia/Manila',
    availability: 'full_time',
    budgetMin: 6,
    budgetMax: 12,
    budgetCurrency: 'USD',
    hoursPerWeek: 40,
    status: 'open'
  });

  // shortlist
  await Shortlist.create({ client: clientProfile._id, clientUser: clientUser._id, va: vaProfile._id, requirement: requirement._id });

  // trial task
  const trialTask = await TrialTask.create({
    client: clientProfile._id,
    clientUser: clientUser._id,
    va: vaProfile._id,
    vaUser: vaProfile.user,
    requirement: requirement._id,
    title: 'Optimize Amazon product listing for a ceramic knife set',
    brief:
      'Using the supplied product info, write an optimized Amazon title (<=200 chars), 5 benefit-led bullets, a short HTML-safe description, and 5 backend search terms. Deliver as text.',
    deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    compensation: 25,
    status: 'passed',
    review: {
      score: 90,
      feedback: 'Excellent listing. Bullets are benefit-led and keywords are relevant.',
      passed: true,
      reviewedAt: new Date(),
      reviewedBy: clientUser._id
    }
  });

  await TrialSubmission.create({
    trialTask: trialTask._id,
    va: vaProfile._id,
    user: vaProfile.user,
    content:
      'Title: Premium Ceramic Knife Set with Ergonomic Handles – 5-Piece Ultra-Sharp Kitchen Knives...\n\nBullets:\n1) EFFORTLESS CUTTING: ...',
    submittedAt: new Date()
  });

  // hiring
  const hiring = await HiringRequest.create({
    client: clientProfile._id,
    clientUser: clientUser._id,
    va: vaProfile._id,
    vaUser: vaProfile.user,
    requirement: requirement._id,
    trialTask: trialTask._id,
    message: 'Loved your trial work. Ready to start this week.',
    proposedRate: 9,
    hoursPerWeek: 40,
    startDate: new Date(),
    status: 'active'
  });

  const engagement = await Engagement.create({
    hiringRequest: hiring._id,
    client: clientProfile._id,
    clientUser: clientUser._id,
    va: vaProfile._id,
    vaUser: vaProfile.user,
    title: 'Listing specialist — ongoing',
    rate: 9,
    hoursPerWeek: 40,
    startDate: new Date(),
    status: 'active'
  });

  hiring.engagement = engagement._id;
  await hiring.save();

  // tasks
  const task1 = await Task.create({
    engagement: engagement._id,
    client: clientProfile._id,
    va: vaProfile._id,
    createdBy: clientUser._id,
    title: 'Rewrite top 10 listings',
    description: 'Rewrite listings 1–10 using the supplied spreadsheet template.',
    priority: 'high',
    deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    status: 'approved',
    submission: {
      content: 'Completed 10 listings. CSV attached.',
      submittedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    },
    approvedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    completedAt: new Date(Date.now() - 12 * 60 * 60 * 1000)
  });

  const task2 = await Task.create({
    engagement: engagement._id,
    client: clientProfile._id,
    va: vaProfile._id,
    createdBy: clientUser._id,
    title: 'Amazon PPC audit',
    description: 'Audit the last 30 days of Sponsored Products campaigns.',
    priority: 'medium',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'pending'
  });

  // performance rollup
  await Performance.create({
    va: vaProfile._id,
    engagement: engagement._id,
    tasksCompleted: 1,
    taskCompletionRate: 50,
    onTimeRate: 100,
    accuracy: 100,
    responsiveness: 95,
    clientRating: 5,
    overallScore: 88
  });

  await VAProfile.findByIdAndUpdate(vaProfile._id, {
    performance: {
      overallScore: 88,
      tasksCompleted: 1,
      taskCompletionRate: 50,
      onTimeRate: 100,
      accuracy: 100,
      responsiveness: 95,
      clientRating: 5
    }
  });

  // review
  await Review.create({
    client: clientProfile._id,
    clientUser: clientUser._id,
    va: vaProfile._id,
    engagement: engagement._id,
    rating: 5,
    comment: 'Excellent work — clear communication and solid listings. Highly recommend.'
  });

  // notifications
  await Notification.create({
    user: vaProfile.user,
    type: 'task_assigned',
    title: 'New task assigned',
    message: 'Rewrite top 10 listings',
    link: '/va/tasks',
    relatedType: 'Task',
    relatedId: task1._id
  });
  await Notification.create({
    user: clientUser._id,
    type: 'trial_submission',
    title: 'Trial submission received',
    message: 'Optimize Amazon product listing for a ceramic knife set',
    link: `/client/trial-tasks/${trialTask._id}`,
    relatedType: 'TrialTask',
    relatedId: trialTask._id
  });

  // conversation
  const conversation = await Conversation.create({
    participants: [clientUser._id, vaProfile.user],
    participantRoles: ['client', 'va'],
    clientUser: clientUser._id,
    vaUser: vaProfile.user,
    lastMessage: { content: 'Starting Monday. Thanks!', sender: clientUser._id, createdAt: new Date() }
  });
  await Message.create({
    conversation: conversation._id,
    sender: clientUser._id,
    senderRole: 'client',
    content: 'Hi Mika, ready to start this week?'
  });
  await Message.create({
    conversation: conversation._id,
    sender: vaProfile.user,
    senderRole: 'va',
    content: 'Yes! I will start Monday morning Manila time.'
  });

  // report
  await Report.create({
    reporter: clientUser._id,
    reporterEmail: clientUser.email,
    type: 'other',
    subject: 'Feature request',
    description: 'Would love bulk CSV import for requirements.',
    status: 'open'
  });

  // audit seed
  await AdminAction.create({
    actor: null,
    actorEmail: 'system',
    action: 'seed.run',
    targetType: 'System',
    description: 'Seed data inserted',
    severity: 'info'
  });

  return { requirement, trialTask, hiring, engagement, task1, task2 };
}

async function run() {
  try {
    await connectDB();
    if (process.argv.includes('--reset')) {
      await reset();
    }
    const skills = await seedSkills();
    const users = await seedUsers();
    const { clientProfile, vaProfile, extraProfiles } = await seedProfiles(users, skills);
    const assessments = await seedAssessments(skills, users.admin);
    await seedAssessmentResults([vaProfile, ...extraProfiles], assessments);
    await seedWorkflow(clientProfile, users.clientUser, vaProfile, extraProfiles, assessments);
    console.log('Seed completed successfully.');
    console.log('Demo credentials (all use password "Password123"):');
    console.log('  admin@ecomva-verify.local');
    console.log('  client@ecomva-verify.local');
    console.log('  va@ecomva-verify.local');
    console.log('  rafael.va@ecomva-verify.local etc.');
    await disconnectDB();
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err);
    await disconnectDB();
    process.exit(1);
  }
}

run();