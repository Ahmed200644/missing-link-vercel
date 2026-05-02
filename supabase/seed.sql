-- ============================================================
-- Missing Link — Seed Data
-- ============================================================
-- INSTRUCTIONS:
-- 1. First run the migration (001_schema.sql)
-- 2. Create an admin user via Supabase Auth dashboard or API
-- 3. Update that user's role: UPDATE profiles SET role = 'admin' WHERE id = '<your-user-uuid>';
-- 4. Then run this seed script.
--    (The subquery below fetches the first admin automatically)
-- ============================================================

DO $$
DECLARE
  admin_id UUID;
BEGIN
  SELECT id INTO admin_id FROM profiles WHERE role = 'admin' LIMIT 1;

  IF admin_id IS NULL THEN
    RAISE EXCEPTION 'No admin profile found. Create an admin user first.';
  END IF;

  INSERT INTO opportunities
    (title, description, opportunity_type, organization_type, field, country, mode, job_time, is_paid, organization, deadline, external_link, is_featured, is_active, created_by)
  VALUES

  -- 1. Job
  (
    'Junior Frontend Developer',
    E'Join our fast-growing product team as a Junior Frontend Developer. You will collaborate with designers and senior engineers to build responsive, accessible web applications using React and Next.js.\n\nResponsibilities include:\n- Building and maintaining UI components\n- Collaborating on design system tokens\n- Writing unit tests and participating in code reviews\n- Optimizing performance and accessibility\n\nThis is an excellent growth opportunity for developers with 0–2 years of experience who want a strong foundation in modern web development.',
    'job',
    'startup',
    'Software Development',
    'Egypt',
    'hybrid',
    'full-time',
    TRUE,
    'TechNile Solutions',
    '2025-03-31',
    'https://technile.example.com/careers/junior-frontend',
    TRUE,
    TRUE,
    admin_id
  ),

  -- 2. Internship
  (
    'Climate Action Youth Fellowship 2025',
    E'A transformative 6-month paid fellowship for young changemakers passionate about climate action and sustainable development.\n\nFellows will:\n- Work on real-world environmental policy and community projects\n- Receive 1:1 mentorship from sustainability leaders\n- Participate in international online conferences\n- Publish research findings in our annual sustainability report\n\nEligible candidates are aged 18–30 from Africa and the Middle East. No prior experience required — only passion, curiosity, and commitment.',
    'internship',
    'ngo',
    'Environmental Science',
    'International',
    'hybrid',
    NULL,
    TRUE,
    'GreenFuture Initiative',
    '2025-02-28',
    'https://greenfuture.example.org/fellowship',
    TRUE,
    TRUE,
    admin_id
  ),

  -- 3. Training
  (
    'Digital Marketing Bootcamp — Cohort 7',
    E'An intensive 4-week online training designed to launch your digital marketing career from zero to job-ready.\n\nTopics covered:\n- SEO and content strategy\n- Paid social advertising (Meta, TikTok, Google)\n- Email marketing and automation\n- Analytics and reporting with Google Analytics 4\n- Portfolio project: run a live campaign\n\nParticipants receive a verified certificate and access to a network of 500+ alumni. Fully free — funded by Cairo Business School''s youth empowerment program.',
    'training',
    'university',
    'Digital Marketing',
    'Egypt',
    'online',
    NULL,
    FALSE,
    'Cairo Business School',
    '2025-03-15',
    'https://cbs.example.edu/bootcamp',
    FALSE,
    TRUE,
    admin_id
  ),

  -- 4. Competition
  (
    'UN Youth Innovation Challenge 2025',
    E'The UN Youth Innovation Challenge invites young people aged 15–29 worldwide to propose technology-driven, human-centred solutions to the most pressing global challenges aligned with the Sustainable Development Goals.\n\nCategories:\n- Climate & Energy (SDG 7, 13)\n- Education & Access (SDG 4)\n- Health & Wellbeing (SDG 3)\n- Economic Opportunity (SDG 8)\n\nTop 10 finalists receive seed funding up to $25,000 USD, mentorship from UN advisors, and an invitation to present at the UN Youth Assembly in New York.',
    'competition',
    'government',
    'Innovation & Technology',
    'International',
    'online',
    NULL,
    FALSE,
    'United Nations Youth Division',
    '2025-04-30',
    'https://unyouth.example.org/challenge',
    TRUE,
    TRUE,
    admin_id
  ),

  -- 5. Youth Event
  (
    'Arab Youth Leadership Summit 2025',
    E'The flagship gathering for the next generation of Arab leaders. Over three days in Dubai, thousands of young changemakers from 22 Arab countries converge to learn, network, and build the future together.\n\nThis year''s theme: "Building Resilient Communities."\n\nHighlights:\n- Keynote addresses from global and regional leaders\n- 30+ interactive workshops on leadership, entrepreneurship, and civic engagement\n- Startup pitch competition with AED 200,000 prize pool\n- Cultural exchange and community-building sessions\n\nTravel grants available for participants from low-income countries. Apply early — spaces are limited.',
    'youth_event',
    'ngo',
    'Leadership',
    'UAE',
    'onsite',
    NULL,
    FALSE,
    'Arab Youth Foundation',
    '2025-05-20',
    'https://arabsummit.example.org/2025',
    FALSE,
    TRUE,
    admin_id
  );

END $$;
