// ── DATA ──────────────────────────────────────────────────────────────────────

const categories = [
  { icon: '💻', name: 'Technology', count: '4,200 jobs' },
  { icon: '🎨', name: 'Design', count: '1,100 jobs' },
  { icon: '📈', name: 'Marketing', count: '980 jobs' },
  { icon: '💰', name: 'Finance', count: '1,340 jobs' },
  { icon: '🏥', name: 'Healthcare', count: '2,100 jobs' },
  { icon: '📚', name: 'Education', count: '760 jobs' },
  { icon: '🏗️', name: 'Engineering', count: '1,500 jobs' },
  { icon: '🛒', name: 'Sales', count: '890 jobs' },
];

const jobs = [
  { id: 1, title: 'Senior React Developer', company: 'TechCorp Inc.', logo: 'TC', location: 'New York, NY', type: 'Full-time', category: 'Technology', salary: '₹9L – ₹12L', skills: ['React', 'TypeScript', 'Node.js', 'AWS'], description: 'We are looking for a Senior React Developer to join our growing engineering team. You will be responsible for building and maintaining high-performance web applications used by millions of users worldwide.', responsibilities: ['Build reusable components and front-end libraries', 'Translate designs into high-quality code', 'Optimize components for maximum performance', 'Collaborate with back-end developers and designers'], featured: true },
  { id: 2, title: 'UX/UI Designer', company: 'DesignHub', logo: 'DH', location: 'San Francisco, CA', type: 'Full-time', category: 'Design', salary: '₹7.5L – ₹9.5L', skills: ['Figma', 'Adobe XD', 'Prototyping', 'User Research'], description: 'Join DesignHub as a UX/UI Designer and help shape the future of digital products. You will work closely with product managers and engineers to create intuitive, beautiful user experiences.', responsibilities: ['Create wireframes, prototypes, and high-fidelity designs', 'Conduct user research and usability testing', 'Maintain and evolve our design system', 'Collaborate with cross-functional teams'], featured: true },
  { id: 3, title: 'Data Scientist', company: 'DataWave', logo: 'DW', location: 'Remote', type: 'Remote', category: 'Technology', salary: '₹10L – ₹13L', skills: ['Python', 'Machine Learning', 'SQL', 'TensorFlow'], description: 'DataWave is seeking a Data Scientist to analyze complex datasets and build predictive models that drive business decisions. This is a fully remote position with flexible hours.', responsibilities: ['Develop machine learning models', 'Analyze large datasets to extract insights', 'Collaborate with engineering to deploy models', 'Present findings to stakeholders'], featured: true },
  { id: 4, title: 'Product Manager', company: 'LaunchPad', logo: 'LP', location: 'Austin, TX', type: 'Full-time', category: 'Technology', salary: '₹8.5L – ₹11L', skills: ['Product Strategy', 'Agile', 'Roadmapping', 'Analytics'], description: 'LaunchPad is looking for an experienced Product Manager to lead our core product team. You will define the product vision, strategy, and roadmap while working closely with engineering and design.', responsibilities: ['Define product vision and strategy', 'Manage product roadmap and backlog', 'Work with stakeholders to prioritize features', 'Analyze metrics and user feedback'], featured: true },
  { id: 5, title: 'DevOps Engineer', company: 'CloudBase', logo: 'CB', location: 'Chicago, IL', type: 'Full-time', category: 'Technology', salary: '₹9L – ₹11.5L', skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'], description: 'CloudBase is hiring a DevOps Engineer to build and maintain our cloud infrastructure. You will work on automating deployments, improving reliability, and scaling our systems.', responsibilities: ['Design and maintain CI/CD pipelines', 'Manage cloud infrastructure on AWS', 'Implement monitoring and alerting', 'Improve system reliability and performance'], featured: false },
  { id: 6, title: 'Digital Marketing Manager', company: 'GrowthLab', logo: 'GL', location: 'New York, NY', type: 'Full-time', category: 'Marketing', salary: '₹6.5L – ₹8L', skills: ['SEO', 'Google Ads', 'Analytics', 'Content Strategy'], description: 'GrowthLab is seeking a Digital Marketing Manager to lead our online marketing efforts. You will develop and execute strategies to drive user acquisition and brand awareness.', responsibilities: ['Develop and execute digital marketing campaigns', 'Manage SEO and paid advertising', 'Analyze campaign performance', 'Manage social media presence'], featured: false },
  { id: 7, title: 'Financial Analyst', company: 'CapitalEdge', logo: 'CE', location: 'Chicago, IL', type: 'Full-time', category: 'Finance', salary: '₹7L – ₹8.5L', skills: ['Excel', 'Financial Modeling', 'SQL', 'PowerBI'], description: 'CapitalEdge is looking for a Financial Analyst to support our investment and planning teams. You will build financial models, analyze data, and provide insights to drive strategic decisions.', responsibilities: ['Build and maintain financial models', 'Prepare monthly financial reports', 'Analyze business performance', 'Support budgeting and forecasting'], featured: false },
  { id: 8, title: 'Backend Engineer (Python)', company: 'APIStack', logo: 'AS', location: 'Remote', type: 'Remote', category: 'Technology', salary: '₹8L – ₹10.5L', skills: ['Python', 'Django', 'PostgreSQL', 'Redis', 'Docker'], description: 'APIStack is hiring a Backend Engineer to build scalable APIs and microservices. You will work on high-traffic systems and collaborate with a distributed team.', responsibilities: ['Design and build RESTful APIs', 'Optimize database queries', 'Write unit and integration tests', 'Participate in code reviews'], featured: false },
  { id: 9, title: 'Graphic Designer', company: 'BrandCraft', logo: 'BC', location: 'San Francisco, CA', type: 'Part-time', category: 'Design', salary: '₹4L – ₹5.5L', skills: ['Illustrator', 'Photoshop', 'Branding', 'Typography'], description: 'BrandCraft is looking for a creative Graphic Designer to join our team part-time. You will create visual assets for digital and print campaigns.', responsibilities: ['Design marketing materials', 'Create social media graphics', 'Maintain brand consistency', 'Collaborate with marketing team'], featured: false },
  { id: 10, title: 'Sales Representative', company: 'SalesForce Pro', logo: 'SP', location: 'Austin, TX', type: 'Full-time', category: 'Sales', salary: '₹5L – ₹7L + incentives', skills: ['CRM', 'Cold Calling', 'Negotiation', 'Salesforce'], description: 'SalesForce Pro is seeking a motivated Sales Representative to grow our client base. You will identify prospects, build relationships, and close deals.', responsibilities: ['Prospect and qualify leads', 'Conduct product demos', 'Negotiate and close contracts', 'Maintain CRM records'], featured: false },
];

const applicants = [
  { name: 'Alex Johnson', email: 'alex@example.com', job: 'Senior React Developer', skills: 'React, Node.js', status: 'Shortlisted', date: 'Jan 15, 2025' },
  { name: 'Maria Garcia', email: 'maria@example.com', job: 'UX/UI Designer', skills: 'Figma, Adobe XD', status: 'Under Review', date: 'Jan 14, 2025' },
  { name: 'James Wilson', email: 'james@example.com', job: 'Senior React Developer', skills: 'React, TypeScript', status: 'Interview', date: 'Jan 13, 2025' },
  { name: 'Sarah Lee', email: 'sarah@example.com', job: 'Product Manager', skills: 'Agile, Analytics', status: 'Applied', date: 'Jan 12, 2025' },
  { name: 'David Kim', email: 'david@example.com', job: 'DevOps Engineer', skills: 'AWS, Docker', status: 'Rejected', date: 'Jan 11, 2025' },
];

const users = [
  { name: 'Alex Johnson', email: 'alex@example.com', role: 'Job Seeker', joined: 'Jan 10, 2025', status: 'Active' },
  { name: 'TechCorp Inc.', email: 'hr@techcorp.com', role: 'Employer', joined: 'Jan 8, 2025', status: 'Active' },
  { name: 'Maria Garcia', email: 'maria@example.com', role: 'Job Seeker', joined: 'Jan 7, 2025', status: 'Active' },
  { name: 'DataWave', email: 'jobs@datawave.com', role: 'Employer', joined: 'Jan 5, 2025', status: 'Active' },
  { name: 'James Wilson', email: 'james@example.com', role: 'Job Seeker', joined: 'Jan 3, 2025', status: 'Inactive' },
  { name: 'GrowthLab', email: 'hr@growthlab.com', role: 'Employer', joined: 'Dec 28, 2024', status: 'Active' },
];

const appliedJobs = [
  { title: 'Senior React Developer', company: 'TechCorp Inc.', location: 'New York, NY', date: 'Jan 15, 2025', status: 'Shortlisted' },
  { title: 'Backend Engineer', company: 'APIStack', location: 'Remote', date: 'Jan 10, 2025', status: 'Under Review' },
  { title: 'Product Manager', company: 'LaunchPad', location: 'Austin, TX', date: 'Jan 5, 2025', status: 'Interview' },
  { title: 'DevOps Engineer', company: 'CloudBase', location: 'Chicago, IL', date: 'Dec 28, 2024', status: 'Applied' },
];

// ── HELPERS ───────────────────────────────────────────────────────────────────

function statusBadge(s) {
  const map = { 'Active': 'badge-green', 'Shortlisted': 'badge-green', 'Interview': 'badge-blue', 'Applied': 'badge-orange', 'Under Review': 'badge-orange', 'Inactive': 'badge-gray', 'Rejected': 'badge-gray', 'Open': 'badge-green', 'Closed': 'badge-gray' };
  return `<span class="badge ${map[s] || 'badge-gray'}">${s}</span>`;
}

function roleBadge(r) {
  return r === 'Employer' ? `<span class="badge badge-blue">${r}</span>` : `<span class="badge badge-orange">${r}</span>`;
}

function jobCard(job, onclick = '') {
  return `
    <div class="job-card" onclick="${onclick || `showJobDetail(${job.id})`}">
      <div class="job-card-header">
        <div class="company-logo">${job.logo}</div>
        <div><h3>${job.title}</h3><div class="company">${job.company}</div></div>
      </div>
      <div class="job-meta">
        <span class="tag">📍 ${job.location}</span>
        <span class="tag orange">⏱ ${job.type}</span>
        <span class="tag green">💼 ${job.category}</span>
      </div>
      <div class="job-card-footer">
        <span class="salary">${job.salary}</span>
        <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); applyJob('${job.title}')">Apply Now</button>
      </div>
    </div>`;
}

// ── INIT ──────────────────────────────────────────────────────────────────────

function init() {
  // Categories
  document.getElementById('categoriesGrid').innerHTML = categories.map(c =>
    `<div class="category-card" onclick="filterByCategory('${c.name}')">
      <div class="cat-icon">${c.icon}</div>
      <p>${c.name}</p><span>${c.count}</span>
    </div>`).join('');

  // Featured jobs (first 4)
  document.getElementById('featuredJobs').innerHTML = jobs.filter(j => j.featured).map(j => jobCard(j)).join('');

  // All jobs
  renderAllJobs(jobs);

  // Seeker applied table
  document.getElementById('seekerAppsTable').innerHTML = appliedJobs.slice(0, 3).map(j =>
    `<tr><td>${j.title}</td><td>${j.company}</td><td>${j.date}</td><td>${statusBadge(j.status)}</td></tr>`).join('');

  document.getElementById('appliedJobsTable').innerHTML = appliedJobs.map(j =>
    `<tr><td>${j.title}</td><td>${j.company}</td><td>${j.location}</td><td>${j.date}</td><td>${statusBadge(j.status)}</td></tr>`).join('');

  // Employer tables
  document.getElementById('employerApplicantsTable').innerHTML = applicants.slice(0, 4).map(a =>
    `<tr><td>${a.name}</td><td>${a.job}</td><td>${a.date}</td><td>${statusBadge(a.status)}</td><td><button class="btn btn-sm btn-outline" onclick="showToast('Viewing ${a.name}')">View</button></td></tr>`).join('');

  document.getElementById('postedJobsTable').innerHTML = jobs.slice(0, 5).map(j =>
    `<tr><td>${j.title}</td><td>${j.location}</td><td>${j.type}</td><td>${Math.floor(Math.random()*30)+5}</td><td>${statusBadge('Open')}</td><td><button class="btn btn-sm btn-danger" onclick="showToast('Job removed')">Remove</button></td></tr>`).join('');

  document.getElementById('allApplicantsTable').innerHTML = applicants.map(a =>
    `<tr><td>${a.name}</td><td>${a.email}</td><td>${a.job}</td><td>${a.skills}</td><td>${statusBadge(a.status)}</td><td><button class="btn btn-sm btn-outline" onclick="showToast('Shortlisted!')">Shortlist</button></td></tr>`).join('');

  // Admin tables
  document.getElementById('adminUsersPreview').innerHTML = users.slice(0, 4).map(u =>
    `<tr><td>${u.name}</td><td>${roleBadge(u.role)}</td><td>${u.joined}</td></tr>`).join('');

  document.getElementById('adminJobsPreview').innerHTML = jobs.slice(0, 4).map(j =>
    `<tr><td>${j.title}</td><td>${j.company}</td><td>${statusBadge('Open')}</td></tr>`).join('');

  document.getElementById('adminUsersTable').innerHTML = users.map(u =>
    `<tr><td>${u.name}</td><td>${u.email}</td><td>${roleBadge(u.role)}</td><td>${u.joined}</td><td>${statusBadge(u.status)}</td><td><button class="btn btn-sm btn-danger" onclick="showToast('User removed')">Remove</button></td></tr>`).join('');

  document.getElementById('adminJobsTable').innerHTML = jobs.map(j =>
    `<tr><td>${j.title}</td><td>${j.company}</td><td>${j.location}</td><td>${j.type}</td><td>${statusBadge('Open')}</td><td><button class="btn btn-sm btn-danger" onclick="showToast('Job removed')">Remove</button></td></tr>`).join('');
}

// ── NAVIGATION ────────────────────────────────────────────────────────────────

function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');
  const navEl = document.getElementById('nav-' + page);
  if (navEl) navEl.classList.add('active');
  document.getElementById('navLinks').classList.remove('open');
  window.scrollTo(0, 0);
}

function toggleNav() {
  document.getElementById('navLinks').classList.toggle('open');
}

// ── JOB LISTINGS ─────────────────────────────────────────────────────────────

function renderAllJobs(list) {
  document.getElementById('jobCount').textContent = `Showing ${list.length} jobs`;
  document.getElementById('allJobsGrid').innerHTML = list.length
    ? list.map(j => jobCard(j)).join('')
    : '<p style="color:var(--gray)">No jobs found matching your criteria.</p>';
}

function filterJobs() {
  const search = document.getElementById('filterSearch').value.toLowerCase();
  const cat = document.getElementById('filterCategory').value;
  const loc = document.getElementById('filterLocation').value;
  const type = document.getElementById('filterType').value;
  const filtered = jobs.filter(j =>
    (!search || j.title.toLowerCase().includes(search) || j.company.toLowerCase().includes(search)) &&
    (!cat || j.category === cat) &&
    (!loc || j.location.includes(loc)) &&
    (!type || j.type === type)
  );
  renderAllJobs(filtered);
}

function searchJobs() {
  const q = document.getElementById('heroSearch').value;
  showPage('jobs');
  document.getElementById('filterSearch').value = q;
  filterJobs();
}

function filterByCategory(cat) {
  showPage('jobs');
  document.getElementById('filterCategory').value = cat;
  filterJobs();
}

// ── JOB DETAIL ────────────────────────────────────────────────────────────────

function showJobDetail(id) {
  const job = jobs.find(j => j.id === id);
  if (!job) return;
  document.getElementById('jobDetailContent').innerHTML = `
    <div class="job-detail-header">
      <div style="display:flex;gap:1rem;align-items:center;">
        <div class="company-logo" style="width:60px;height:60px;font-size:1.3rem;">${job.logo}</div>
        <div>
          <h1>${job.title}</h1>
          <div style="color:var(--gray);font-size:0.95rem;">${job.company} · ${job.location}</div>
          <div class="job-meta" style="margin-top:0.5rem;">
            <span class="tag orange">⏱ ${job.type}</span>
            <span class="tag green">💼 ${job.category}</span>
          </div>
        </div>
      </div>
      <div style="text-align:right;">
        <div style="font-size:1.3rem;font-weight:800;color:var(--primary);margin-bottom:0.5rem;">${job.salary}</div>
        <button class="btn btn-primary" onclick="applyJob('${job.title}')">Apply Now</button>
      </div>
    </div>
    <div class="job-detail-body">
      <h3>About the Role</h3>
      <p>${job.description}</p>
      <h3>Responsibilities</h3>
      <ul>${job.responsibilities.map(r => `<li>${r}</li>`).join('')}</ul>
      <h3>Required Skills</h3>
      <div class="skills-list">${job.skills.map(s => `<span class="tag orange">${s}</span>`).join('')}</div>
      <h3>Salary</h3>
      <p>${job.salary} per year</p>
    </div>`;
  showPage('job-detail');
}

// ── AUTH ──────────────────────────────────────────────────────────────────────

function handleLogin() {
  const role = document.getElementById('loginRole').value;
  const email = document.getElementById('loginEmail').value;
  if (!email) { showToast('Please enter your email'); return; }
  showToast('Login successful! Redirecting...', 'success');
  setTimeout(() => {
    if (role === 'admin') showPage('admin');
    else if (role === 'employer') showPage('employer');
    else showPage('seeker');
  }, 1000);
}

function handleRegister() {
  showToast('Account created! Please sign in.', 'success');
  setTimeout(() => showPage('login'), 1200);
}

// ── APPLY ─────────────────────────────────────────────────────────────────────

function applyJob(title) {
  showToast(`Applied to "${title}" successfully!`, 'success');
}

// ── DASHBOARD TABS ────────────────────────────────────────────────────────────

function seekerTab(tab, el) {
  ['overview', 'profile', 'applied', 'resume'].forEach(t =>
    document.getElementById('seeker-' + t).style.display = 'none');
  document.getElementById('seeker-' + tab).style.display = 'block';
  document.querySelectorAll('#page-seeker .sidebar-nav a').forEach(a => a.classList.remove('active'));
  el.classList.add('active');
}

function employerTab(tab, el) {
  ['overview', 'post', 'posted', 'applicants'].forEach(t =>
    document.getElementById('employer-' + t).style.display = 'none');
  document.getElementById('employer-' + tab).style.display = 'block';
  document.querySelectorAll('#page-employer .sidebar-nav a').forEach(a => a.classList.remove('active'));
  el.classList.add('active');
}

function adminTab(tab, el) {
  ['overview', 'users', 'jobs'].forEach(t =>
    document.getElementById('admin-' + t).style.display = 'none');
  document.getElementById('admin-' + tab).style.display = 'block';
  document.querySelectorAll('#page-admin .sidebar-nav a').forEach(a => a.classList.remove('active'));
  el.classList.add('active');
}

// ── TOAST ─────────────────────────────────────────────────────────────────────

function showToast(msg, type = '') {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.className = 'toast show' + (type ? ' ' + type : '');
  setTimeout(() => t.classList.remove('show'), 3000);
}

// ── START ─────────────────────────────────────────────────────────────────────
init();
