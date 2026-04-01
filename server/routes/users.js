const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');
const Job = require('../models/Job');
const { protect } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

// ── Extract text from resume file ─────────────────────────────────────────────
async function extractText(filePath, ext) {
  if (ext === '.pdf') {
    try {
      const data = await pdfParse(fs.readFileSync(filePath));
      if (data.text && data.text.trim().length > 50) return data.text;
    } catch {}
    // If pdf-parse fails or returns empty, return empty so Gemini native kicks in
    return '';
  }
  if (ext === '.docx' || ext === '.doc') {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }
  return fs.readFileSync(filePath, 'utf8');
}

// ── Send file directly to Gemini as base64 (works for any PDF) ───────────────
async function extractTextWithGemini(filePath, ext) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const fileBuffer = fs.readFileSync(filePath);
    const base64 = fileBuffer.toString('base64');
    const mimeType = ext === '.pdf' ? 'application/pdf'
      : ext === '.docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      : 'application/msword';

    const result = await model.generateContent([
      { inlineData: { data: base64, mimeType } },
      { text: 'Extract and return ALL text content from this resume document. Return only the plain text, no formatting.' }
    ]);
    return result.response.text();
  } catch (err) {
    console.error('Gemini file read error:', err.message);
    return '';
  }
}

// ── Shared helper: read actual resume file, fall back to saved skills ─────────
async function getResumeText(user) {
  if (user.resumeUrl) {
    const filePath = path.join(__dirname, '../uploads', path.basename(user.resumeUrl));
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath).toLowerCase();
      try {
        let text = await extractText(filePath, ext);
        if (!text || text.trim().length < 50) {
          console.log('Text extraction empty, using Gemini native reader...');
          text = await extractTextWithGemini(filePath, ext);
        }
        if (text && text.trim().length > 0) return text;
      } catch (e) { console.error('getResumeText error:', e.message); }
    }
  }
  if (user.skills && user.skills.length > 0)
    return `Skills: ${user.skills.join(', ')}. Experience: ${user.experience || ''}`;
  return '';
}

// ── Gemini: score one job against resume ──────────────────────────────────────
async function scoreOneJob(resumeText, job) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `You are an ATS analyzer. Score how well this resume matches this job on a scale of 0-100.

RESUME:
"""${resumeText.slice(0, 3000)}"""

JOB: ${job.title} | Skills required: ${job.skills.join(', ')} | Description: ${job.description}

Respond ONLY with valid JSON: { "matchScore": 85, "reason": "short reason max 15 words" }`;
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return { aiScore: parsed.matchScore, aiReason: parsed.reason };
    }
  } catch {}
  return { aiScore: null, aiReason: '' };
}

// ── AI-powered job matching using Gemini ──────────────────────────────────────
async function matchJobsWithAI(resumeText, jobs) {
  if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your_gemini_api_key_here') {
    return keywordMatch(resumeText, jobs);
  }
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const jobList = jobs.map((j, i) =>
      `${i}. ID:${j._id} | "${j.title}" at ${j.company} | Skills: ${j.skills.join(', ')} | Category: ${j.category}`
    ).join('\n');

    const prompt = `You are an expert career counselor and resume analyzer.

Analyze the following resume and match it against the job listings below.

RESUME:
"""
${resumeText.slice(0, 4000)}
"""

JOB LISTINGS:
${jobList}

Instructions:
- Match ALL relevant jobs — include every job that is a reasonable fit
- For each matched job return the index number and a short reason (max 15 words)
- Consider partial matches and transferable skills
- Also extract the top skills found in the resume

Respond ONLY with valid JSON:
{
  "extractedSkills": ["skill1", "skill2"],
  "matches": [
    { "index": 0, "score": 95, "reason": "Strong React and JavaScript skills match perfectly" }
  ]
}`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    const parsed = JSON.parse(jsonMatch[0]);

    const matchedJobs = parsed.matches
      .filter(m => m.score >= 40)
      .sort((a, b) => b.score - a.score)
      .map(m => ({
        ...jobs[m.index].toObject(),
        aiScore: m.score,
        aiReason: m.reason,
        matchedSkills: jobs[m.index].skills.filter(s =>
          resumeText.toLowerCase().includes(s.toLowerCase())
        ),
      }));

    return { matchedJobs, extractedSkills: parsed.extractedSkills || [] };
  } catch (err) {
    console.error('Gemini error, falling back to keyword match:', err.message);
    return keywordMatch(resumeText, jobs);
  }
}

// ── Keyword fallback matcher ───────────────────────────────────────────────────
function keywordMatch(resumeText, jobs) {
  const text = resumeText.toLowerCase();
  const allSkills = [...new Set(jobs.flatMap(j => j.skills))];
  const extractedSkills = allSkills.filter(s => text.includes(s.toLowerCase()));

  const scored = jobs.map(job => {
    let score = 0;
    const matchedSkills = [];
    job.skills.forEach(s => { if (text.includes(s.toLowerCase())) { score += 10; matchedSkills.push(s); } });
    job.title.toLowerCase().split(' ').forEach(w => { if (w.length > 3 && text.includes(w)) score += 5; });
    if (text.includes(job.category.toLowerCase())) score += 3;
    return { ...job.toObject(), aiScore: score, matchedSkills, aiReason: matchedSkills.length > 0 ? `Matched skills: ${matchedSkills.join(', ')}` : '' };
  });

  return {
    matchedJobs: scored.filter(j => j.aiScore > 0).sort((a, b) => b.aiScore - a.aiScore),
    extractedSkills,
  };
}

// ── PUT /api/users/profile ────────────────────────────────────────────────────
router.put('/profile', protect, async (req, res) => {
  try {
    const allowed = ['name', 'location', 'skills', 'experience', 'companyName', 'companyDescription'];
    const updates = {};
    allowed.forEach(k => { if (req.body[k] !== undefined) updates[k] = req.body[k]; });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── POST /api/users/resume — upload + AI scan + recommend ─────────────────────
router.post('/resume', protect, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const resumeUrl = `/uploads/${req.file.filename}`;
    const filePath = path.join(__dirname, '../uploads', req.file.filename);
    const ext = path.extname(req.file.originalname).toLowerCase();

    await User.findByIdAndUpdate(req.user._id, { resumeUrl });

    let extractedSkills = [];
    let recommendations = [];

    try {
      let resumeText = await extractText(filePath, ext);
      if (!resumeText || resumeText.trim().length < 50) {
        console.log('PDF text empty, using Gemini native reader...');
        resumeText = await extractTextWithGemini(filePath, ext);
      }
      const jobs = await Job.find({ isActive: true });

      const { matchedJobs, extractedSkills: skills } = await matchJobsWithAI(resumeText, jobs);
      extractedSkills = skills;

      // Score each matched job individually — same logic as /match/:jobId
      recommendations = await Promise.all(matchedJobs.map(async (job) => {
        const { aiScore, aiReason } = await scoreOneJob(resumeText, job);
        return { ...job, aiScore: aiScore !== null ? aiScore : job.aiScore, aiReason: aiReason || job.aiReason };
      }));

      if (extractedSkills.length > 0) {
        await User.findByIdAndUpdate(req.user._id, { skills: extractedSkills });
      }
    } catch (parseErr) {
      console.error('Resume processing error:', parseErr.message);
    }

    res.json({ resumeUrl, extractedSkills, recommendations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/users/recommendations — reads actual resume file ─────────────────
router.get('/recommendations', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const resumeText = await getResumeText(user);
    if (!resumeText) return res.json([]);

    const jobs = await Job.find({ isActive: true });
    const { matchedJobs } = await matchJobsWithAI(resumeText, jobs);

    // Score each job individually — same logic as /match/:jobId
    const scored = await Promise.all(matchedJobs.map(async (job) => {
      const { aiScore, aiReason } = await scoreOneJob(resumeText, job);
      return { ...job, aiScore: aiScore !== null ? aiScore : job.aiScore, aiReason: aiReason || job.aiReason };
    }));

    res.json(scored);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/users/match/:jobId — deep AI analysis for one job ────────────────
router.get('/match/:jobId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const resumeText = await getResumeText(user);
    if (!resumeText) return res.json({ hasResume: false });

    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const prompt = `You are an expert career counselor and ATS analyzer.

Analyze how well this candidate's resume matches the job requirements below.

RESUME:
"""
${resumeText.slice(0, 4000)}
"""

JOB:
Title: ${job.title}
Company: ${job.company}
Category: ${job.category}
Required Skills: ${job.skills.join(', ')}
Description: ${job.description}

Provide:
1. Overall match percentage (0-100)
2. Matched strengths
3. Missing skills or gaps
4. Specific suggestions to improve resume for this job
5. Short overall verdict (2 sentences)

Respond ONLY with valid JSON:
{
  "matchScore": 78,
  "verdict": "Strong candidate with good technical skills. A few gaps in required tools.",
  "strengths": ["3 years React experience matches job requirement"],
  "missingSkills": ["TypeScript required but not mentioned in resume"],
  "suggestions": ["Add TypeScript projects to your portfolio"],
  "matchedSkills": ["React", "Node.js"],
  "missingSkillTags": ["TypeScript", "AWS"]
}`;
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON');
        const analysis = JSON.parse(jsonMatch[0]);
        return res.json({ hasResume: true, aiPowered: true, ...analysis });
      } catch (aiErr) {
        console.error('Gemini match error:', aiErr.message);
      }
    }

    // Keyword fallback
    const text = resumeText.toLowerCase();
    const matchedSkills = job.skills.filter(s => text.includes(s.toLowerCase()));
    const missingSkillTags = job.skills.filter(s => !text.includes(s.toLowerCase()));
    const matchScore = Math.round((matchedSkills.length / Math.max(job.skills.length, 1)) * 100);
    res.json({
      hasResume: true, aiPowered: false, matchScore,
      verdict: `You match ${matchedSkills.length} of ${job.skills.length} required skills for this role.`,
      strengths: matchedSkills.map(s => `${s} found in your resume`),
      missingSkills: missingSkillTags.map(s => `${s} — required but not found in resume`),
      suggestions: missingSkillTags.map(s => `Learn or add ${s} to your resume`),
      matchedSkills, missingSkillTags,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── GET /api/users/courses/:jobId — AI suggests courses for missing skills ─────
router.get('/courses/:jobId', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    const resumeText = await getResumeText(user);
    if (!resumeText) return res.json({ hasResume: false, courses: [] });

    const resumeLower = resumeText.toLowerCase();
    const missingSkills = job.skills.filter(s => !resumeLower.includes(s.toLowerCase()));
    if (missingSkills.length === 0)
      return res.json({ hasResume: true, missingSkills: [], courses: [] });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' }, { apiVersion: 'v1beta' });

    const prompt = `Search the internet and find the best online courses and certifications for these skills: ${missingSkills.join(', ')}.

For each skill find 2 real courses from Coursera, Udemy, edX, LinkedIn Learning, freeCodeCamp, or YouTube.

Respond ONLY with valid JSON:
{
  "courses": [
    {
      "skill": "C Programming",
      "title": "C Programming For Beginners",
      "platform": "Udemy",
      "url": "https://www.udemy.com/course/c-programming-for-beginners-/",
      "duration": "23 hours",
      "free": false,
      "level": "Beginner"
    }
  ]
}`;

    try {
      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        tools: [{ googleSearch: {} }],
      });
      const text = result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error('No JSON');
      const parsed = JSON.parse(jsonMatch[0]);
      return res.json({ hasResume: true, missingSkills, courses: parsed.courses || [], webSearched: true });
    } catch (aiErr) {
      console.error('Gemini course search error:', aiErr.message);
      const fallbackCourses = missingSkills.flatMap(skill => [
        { skill, title: `${skill} — Full Course`, platform: 'freeCodeCamp (YouTube)', url: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' full course')}`, duration: 'Varies', free: true, level: 'Beginner' },
        { skill, title: `${skill} Courses`, platform: 'Coursera', url: `https://www.coursera.org/search?query=${encodeURIComponent(skill)}`, duration: 'Varies', free: false, level: 'Beginner' },
      ]);
      return res.json({ hasResume: true, missingSkills, courses: fallbackCourses, webSearched: false });
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
