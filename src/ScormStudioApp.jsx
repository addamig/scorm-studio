import { useState, useCallback, useRef, useEffect, useMemo } from "react";

// ─── SVG Illustration Generator ───
const iconPaths = {
  shield: "M12 2l8 4v6c0 5.25-3.4 10.1-8 12-4.6-1.9-8-6.75-8-12V6l8-4z",
  lock: "M18 8h-1V6A5 5 0 007 6v2H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V10a2 2 0 00-2-2zM9 6a3 3 0 016 0v2H9V6z",
  mail: "M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm8 7L4 6v1l8 5 8-5V6l-8 5z",
  alert: "M12 2L1 21h22L12 2zm0 4l7.5 13h-15L12 6zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z",
  fire: "M12 23c-3.6 0-7-2.4-7-7 0-3.3 2.1-5.7 4-7.8l.7-.8c.4-.4 1-.4 1.3.1.8 1.4 2.1 2.3 3 2.8-.3-1.5-.2-3 .8-4.8.3-.5 1-.6 1.4-.2C18.5 7.5 19 10.3 19 13c0 5.5-3.2 10-7 10z",
  eye: "M12 5C5.6 5 1 12 1 12s4.6 7 11 7 11-7 11-7-4.6-7-11-7zm0 12a5 5 0 110-10 5 5 0 010 10zm0-8a3 3 0 100 6 3 3 0 000-6z",
  key: "M12.5 2a5.5 5.5 0 00-4.9 8L2 15.6V20h4v-2h2v-2h2l1.3-1.3A5.5 5.5 0 0012.5 2zm1.5 5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z",
  users: "M16 11a3 3 0 100-6 3 3 0 000 6zm-8 0a3 3 0 100-6 3 3 0 000 6zm8 2c-2.3 0-7 1.2-7 3.5V19h14v-2.5c0-2.3-4.7-3.5-7-3.5zm-8 0c-.3 0-.6 0-1 .1 1.2.9 2 2 2 3.4V19H1v-2.5C1 14.2 5.7 13 8 13z",
  book: "M4 2h14a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zm1 2v16h13V4H5zm2 3h9v2H7V7zm0 4h9v2H7v-2z",
  check: "M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z",
  laptop: "M3 5a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm-2 13h22v2H1v-2z",
  globe: "M12 2a10 10 0 100 20 10 10 0 000-20zm-1 17.93A8 8 0 014 12h3v2a2 2 0 002 2h1v3.93zM17.6 16H16a2 2 0 01-2-2v-1a2 2 0 012-2h2.83A8 8 0 0120 12a8 8 0 01-2.4 4z",
  heart: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
  building: "M3 21h18v-2H3v2zM5 9v10h4V9H5zm6 0v10h4V9h-4zm6 0v10h4V9h-4zM4 7h16l-8-6-8 6z",
  chart: "M3 3v18h18v-2H5V3H3zm4 10v4h2v-4H7zm4-6v10h2V7h-2zm4 4v6h2v-6h-2z",
  clock: "M12 2a10 10 0 100 20 10 10 0 000-20zm1 10.41l3.3 3.3-1.42 1.42L11 13.29V6h2v6.41z",
  megaphone: "M18 4l-4 4H6a2 2 0 00-2 2v4a2 2 0 002 2h2l6 5V4zM20 9v6m2-8v10",
  medical: "M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-4 10h-2v2a1 1 0 01-2 0v-2H9a1 1 0 010-2h2V9a1 1 0 012 0v2h2a1 1 0 010 2z",
};

const keywordToIcons = {
  'säkerhet': ['shield', 'lock', 'key'], 'security': ['shield', 'lock', 'key'],
  'phishing': ['mail', 'alert', 'shield'], 'mejl': ['mail', 'alert'],
  'lösenord': ['key', 'lock', 'shield'], 'password': ['key', 'lock'],
  'brand': ['fire', 'alert', 'building'], 'fire': ['fire', 'alert'],
  'utrymning': ['building', 'alert', 'users'], 'evacuation': ['building', 'alert'],
  'gdpr': ['shield', 'lock', 'users'], 'dataskydd': ['shield', 'lock', 'globe'],
  'personuppgift': ['users', 'lock', 'shield'], 'samtycke': ['check', 'users'],
  'arbetsmiljö': ['building', 'users', 'heart'], 'ergonomi': ['laptop', 'medical'],
  'onboarding': ['users', 'book', 'heart'], 'välkommen': ['heart', 'users', 'book'],
  'quiz': ['check', 'chart', 'book'], 'test': ['check', 'chart'],
  'scenario': ['eye', 'alert', 'users'], 'sammanfattning': ['book', 'check', 'chart'],
  'desk': ['laptop', 'building', 'lock'], 'clean': ['laptop', 'check'],
  'risk': ['alert', 'shield', 'chart'], 'incident': ['alert', 'megaphone'],
  'rapport': ['chart', 'book', 'megaphone'], 'utbildning': ['book', 'users', 'chart'],
  'hälsa': ['heart', 'medical', 'users'], 'health': ['heart', 'medical'],
  '2fa': ['key', 'lock', 'shield'], 'autentisering': ['key', 'lock'],
  'social': ['users', 'mail', 'alert'], 'data': ['lock', 'shield', 'globe'],
};

function getSlideIcons(slide) {
  const text = [slide.title, slide.subtitle, slide.scenario_title, slide.scenario_description,
    ...(slide.blocks||[]).map(b => b.content || (b.items||[]).join(' ')),
    ...(slide.points||[])].filter(Boolean).join(' ').toLowerCase();
  const matched = new Set();
  for (const [keyword, icons] of Object.entries(keywordToIcons)) {
    if (text.includes(keyword)) icons.forEach(i => matched.add(i));
  }
  const result = [...matched].slice(0, 3);
  if (result.length === 0) return ['book', 'chart', 'users'];
  while (result.length < 2) result.push('check');
  return result;
}

function SlideIllustration({ slide, slideIndex, themeColor = '#6366f1' }) {
  const icons = useMemo(() => getSlideIcons(slide), [slide]);
  const seed = slideIndex * 137;
  const primary = themeColor;

  const patterns = [
    (iconNames) => (
      <svg viewBox="0 0 280 160" style={{ width: '100%', height: 'auto', maxHeight: 160 }}>
        <defs>
          <linearGradient id={`g${seed}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primary} stopOpacity="0.15" />
            <stop offset="100%" stopColor={primary} stopOpacity="0.05" />
          </linearGradient>
        </defs>
        <rect width="280" height="160" rx="12" fill={`url(#g${seed})`} />
        <circle cx="140" cy="80" r="44" fill={primary} fillOpacity="0.1" stroke={primary} strokeOpacity="0.2" strokeWidth="1.5" />
        <circle cx="140" cy="80" r="30" fill={primary} fillOpacity="0.08" />
        <g transform="translate(128,68) scale(1)" fill={primary} fillOpacity="0.7"><path d={iconPaths[iconNames[0]] || iconPaths.book} /></g>
        {iconNames[1] && <><circle cx="60" cy="45" r="18" fill={primary} fillOpacity="0.06" /><g transform="translate(49,34) scale(0.9)" fill={primary} fillOpacity="0.35"><path d={iconPaths[iconNames[1]] || iconPaths.check} /></g></>}
        {iconNames[2] && <><circle cx="225" cy="115" r="16" fill={primary} fillOpacity="0.06" /><g transform="translate(214.5,104.5) scale(0.85)" fill={primary} fillOpacity="0.3"><path d={iconPaths[iconNames[2]] || iconPaths.chart} /></g></>}
        <circle cx="45" cy="130" r="3" fill={primary} fillOpacity="0.15" />
        <circle cx="235" cy="35" r="3" fill={primary} fillOpacity="0.12" />
      </svg>
    ),
    (iconNames) => (
      <svg viewBox="0 0 280 130" style={{ width: '100%', height: 'auto', maxHeight: 130 }}>
        <defs>
          <linearGradient id={`g${seed}b`} x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor={primary} stopOpacity="0.12" />
            <stop offset="50%" stopColor={primary} stopOpacity="0.04" />
            <stop offset="100%" stopColor={primary} stopOpacity="0.12" />
          </linearGradient>
        </defs>
        <rect width="280" height="130" rx="12" fill={`url(#g${seed}b)`} />
        <line x1="75" y1="65" x2="205" y2="65" stroke={primary} strokeOpacity="0.12" strokeWidth="2" strokeDasharray="6 4" />
        {iconNames.slice(0, 3).map((name, i) => {
          const cx = 65 + i * 75;
          return (<g key={i}><circle cx={cx} cy="65" r={24 - i * 2} fill={primary} fillOpacity={0.08 + i * 0.02} stroke={primary} strokeOpacity={0.15} strokeWidth="1" /><g transform={`translate(${cx-12},${53}) scale(1)`} fill={primary} fillOpacity={0.5 - i * 0.1}><path d={iconPaths[name] || iconPaths.book} /></g></g>);
        })}
      </svg>
    ),
    (iconNames) => (
      <svg viewBox="0 0 280 140" style={{ width: '100%', height: 'auto', maxHeight: 140 }}>
        <defs>
          <linearGradient id={`g${seed}c`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={primary} stopOpacity="0.1" />
            <stop offset="100%" stopColor={primary} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <rect width="280" height="140" rx="12" fill={`url(#g${seed}c)`} />
        <rect x="20" y="60" width="240" height="4" rx="2" fill={primary} fillOpacity="0.08" />
        <g transform="translate(30,22) scale(1.2)" fill={primary} fillOpacity="0.5"><path d={iconPaths[iconNames[0]] || iconPaths.book} /></g>
        {iconNames[1] && <g transform="translate(125,78) scale(1)" fill={primary} fillOpacity="0.35"><path d={iconPaths[iconNames[1]] || iconPaths.check} /></g>}
        {iconNames[2] && <g transform="translate(222,85) scale(0.9)" fill={primary} fillOpacity="0.25"><path d={iconPaths[iconNames[2]] || iconPaths.chart} /></g>}
        <circle cx="260" cy="25" r="8" fill={primary} fillOpacity="0.06" />
        <circle cx="20" cy="120" r="6" fill={primary} fillOpacity="0.06" />
      </svg>
    ),
  ];
  return patterns[seed % patterns.length](icons);
}

// ─── SCORM Package Generator ───
function generateImsManifest(course) {
  const title = course.title.replace(/&/g,'&amp;').replace(/</g,'&lt;');
  return `<?xml version="1.0" encoding="UTF-8"?>
<manifest identifier="${course.id || 'course_001'}" version="1.0"
  xmlns="http://www.imsglobal.org/xsd/imscp_v1p1"
  xmlns:adlcp="http://www.adlnet.org/xsd/adlcp_v1p3"
  xmlns:adlseq="http://www.adlnet.org/xsd/adlseq_v1p3"
  xmlns:adlnav="http://www.adlnet.org/xsd/adlnav_v1p3"
  xmlns:imsss="http://www.imsglobal.org/xsd/imsss"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <metadata><schema>ADL SCORM</schema><schemaversion>2004 4th Edition</schemaversion></metadata>
  <organizations default="ORG_001"><organization identifier="ORG_001"><title>${title}</title>
  <item identifier="ITEM_001" identifierref="RES_001"><title>${title}</title>
  <imsss:sequencing><imsss:deliveryControls tracked="true" completionSetByContent="true" objectiveSetByContent="true"/></imsss:sequencing>
  </item></organization></organizations>
  <resources><resource identifier="RES_001" type="webcontent" adlcp:scormType="sco" href="index.html">
  <file href="index.html"/><file href="scorm_api.js"/></resource></resources>
</manifest>`;
}

function esc(s) { return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

function generateSvgIllustration(slide, idx, primaryColor) {
  const text = [slide.title, slide.subtitle, slide.scenario_title, slide.scenario_description,
    ...(slide.blocks||[]).map(b => b.content || (b.items||[]).join(' ')),
    ...(slide.points||[])].filter(Boolean).join(' ').toLowerCase();
  const matched = new Set();
  for (const [kw, icons] of Object.entries(keywordToIcons)) {
    if (text.includes(kw)) icons.forEach(i => matched.add(i));
  }
  const icons = [...matched].slice(0, 3);
  if (icons.length === 0) { icons.push('book', 'chart'); }
  while (icons.length < 2) icons.push('check');
  const p = primaryColor || '#1a56db';
  const seed = idx * 137;
  const pattern = seed % 3;
  const iconSvg = (name, x, y, scale, opacity) =>
    `<g transform="translate(${x},${y}) scale(${scale})" fill="${p}" fill-opacity="${opacity}"><path d="${iconPaths[name]||iconPaths.book}"/></g>`;
  if (pattern === 0) {
    return `<svg viewBox="0 0 280 160" style="width:100%;max-height:160px;margin-bottom:16px"><defs><linearGradient id="ig${seed}" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${p}" stop-opacity="0.15"/><stop offset="100%" stop-color="${p}" stop-opacity="0.05"/></linearGradient></defs><rect width="280" height="160" rx="12" fill="url(#ig${seed})"/><circle cx="140" cy="80" r="44" fill="${p}" fill-opacity="0.1" stroke="${p}" stroke-opacity="0.2" stroke-width="1.5"/><circle cx="140" cy="80" r="30" fill="${p}" fill-opacity="0.08"/>${iconSvg(icons[0],128,68,1,0.7)}${icons[1]?`<circle cx="60" cy="45" r="18" fill="${p}" fill-opacity="0.06"/>${iconSvg(icons[1],49,34,0.9,0.35)}`:''}${icons[2]?`<circle cx="225" cy="115" r="16" fill="${p}" fill-opacity="0.06"/>${iconSvg(icons[2],214.5,104.5,0.85,0.3)}`:''}<circle cx="45" cy="130" r="3" fill="${p}" fill-opacity="0.15"/><circle cx="235" cy="35" r="3" fill="${p}" fill-opacity="0.12"/></svg>`;
  } else if (pattern === 1) {
    return `<svg viewBox="0 0 280 130" style="width:100%;max-height:130px;margin-bottom:16px"><defs><linearGradient id="ig${seed}b" x1="0%" y1="50%" x2="100%" y2="50%"><stop offset="0%" stop-color="${p}" stop-opacity="0.12"/><stop offset="50%" stop-color="${p}" stop-opacity="0.04"/><stop offset="100%" stop-color="${p}" stop-opacity="0.12"/></linearGradient></defs><rect width="280" height="130" rx="12" fill="url(#ig${seed}b)"/><line x1="75" y1="65" x2="205" y2="65" stroke="${p}" stroke-opacity="0.12" stroke-width="2" stroke-dasharray="6 4"/>${icons.slice(0,3).map((name,i)=>{const cx=65+i*75;return`<circle cx="${cx}" cy="65" r="${24-i*2}" fill="${p}" fill-opacity="${0.08+i*0.02}" stroke="${p}" stroke-opacity="0.15" stroke-width="1"/>${iconSvg(name,cx-12,53,1,0.5-i*0.1)}`;}).join('')}</svg>`;
  } else {
    return `<svg viewBox="0 0 280 140" style="width:100%;max-height:140px;margin-bottom:16px"><defs><linearGradient id="ig${seed}c" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="${p}" stop-opacity="0.1"/><stop offset="100%" stop-color="${p}" stop-opacity="0.02"/></linearGradient></defs><rect width="280" height="140" rx="12" fill="url(#ig${seed}c)"/><rect x="20" y="60" width="240" height="4" rx="2" fill="${p}" fill-opacity="0.08"/>${iconSvg(icons[0],30,22,1.2,0.5)}${icons[1]?iconSvg(icons[1],125,78,1,0.35):''}${icons[2]?iconSvg(icons[2],222,85,0.9,0.25):''}<circle cx="260" cy="25" r="8" fill="${p}" fill-opacity="0.06"/><circle cx="20" cy="120" r="6" fill="${p}" fill-opacity="0.06"/></svg>`;
  }
}

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `${r},${g},${b}`;
}

function generateCourseHtml(course) {
  const pColor = course.theme?.primary || '#1a56db';
  const aColor = course.theme?.accent || '#f59e0b';
  let slideIndex = 0;
  const moduleMap = [];
  let slidesHtml = '';

  for (let mi = 0; mi < course.modules.length; mi++) {
    const mod = course.modules[mi];
    const startSlide = slideIndex;
    for (let si = 0; si < (mod.slides||[]).length; si++) {
      const slide = mod.slides[si];
      const illustration = generateSvgIllustration(slide, slideIndex, pColor);
      let html = '';
      // Check if this module has a video (first slide gets it)
      const moduleHasVideo = mod.video_url && si === 0;

      if (slide.type === 'title') {
        const imgHtml = slide.generated_image
          ? `<img src="${slide.generated_image}" alt="${esc(slide.title)}" style="max-width:520px;width:100%;border-radius:12px;margin-bottom:20px;box-shadow:0 4px 16px rgba(0,0,0,0.1)"/>`
          : illustration;
        const videoHtml = moduleHasVideo
          ? `<div class="video-wrapper" style="margin:20px auto;max-width:720px"><video id="vid-${slideIndex}" controls style="width:100%;border-radius:12px;box-shadow:0 4px 20px rgba(0,0,0,0.15)"><source src="${mod.video_url}" type="video/mp4">Din webbläsare stöder inte video.</video></div>`
          : '';
        html = `<div class="slide-center">${videoHtml || imgHtml}<h2 class="slide-title">${esc(slide.title)}</h2><p class="slide-subtitle">${esc(slide.subtitle||'')}</p></div>`;
      } else if (slide.type === 'content') {
        let blocksHtml = '';
        for (const b of (slide.blocks||[])) {
          if (b.type === 'text') blocksHtml += `<p class="block-text">${esc(b.content)}</p>`;
          else if (b.type === 'heading') blocksHtml += `<h3 class="block-heading">${esc(b.content)}</h3>`;
          else if (b.type === 'bullets') blocksHtml += `<ul class="block-bullets">${(b.items||[]).map(it => `<li>${esc(it)}</li>`).join('')}</ul>`;
          else if (b.type === 'info') blocksHtml += `<div class="block-info">${esc(b.content)}</div>`;
          else if (b.type === 'warning') blocksHtml += `<div class="block-warning">${esc(b.content)}</div>`;
          else if (b.type === 'keypoint') blocksHtml += `<div class="block-keypoint"><div class="kp-label">Viktigt</div><p>${esc(b.content)}</p></div>`;
        }
        html = `${illustration}<h2 class="slide-title-sm">${esc(slide.title)}</h2>${blocksHtml}`;
      } else if (slide.type === 'scenario') {
        const fid = `fb-${slideIndex}`;
        const optHtml = (slide.options||[]).map((o,oi) =>
          `<button class="scenario-option" data-correct="${o.correct}" data-feedback="${esc(o.feedback||'')}" onclick="handleScenario(this,${o.correct},'${fid}')">${esc(o.text)}</button>`
        ).join('');
        html = `${illustration}<h2 class="slide-title-sm">${esc(slide.title||slide.scenario_title)}</h2><p class="scenario-desc">${esc(slide.scenario_description||'')}</p><div class="scenario-options">${optHtml}</div><div class="scenario-feedback" id="${fid}"></div>`;
      } else if (slide.type === 'summary') {
        html = `${illustration}<h2 class="slide-title-sm">${esc(slide.title)}</h2><ul class="summary-list">${(slide.points||[]).map(p => `<li>${esc(p)}</li>`).join('')}</ul>`;
      } else if (slide.type === 'quiz') {
        let qHtml = '';
        for (let qi = 0; qi < (slide.questions||[]).length; qi++) {
          const q = slide.questions[qi];
          qHtml += `<div class="quiz-q" id="quiz-q-${qi}"><p class="quiz-question"><span class="q-num">${qi+1}.</span> ${esc(q.question)}</p><div class="quiz-options">${(q.options||[]).map((o,oi) => `<button class="quiz-option" onclick="selectQuizAnswer(${qi},${oi})">${esc(o)}</button>`).join('')}</div></div>`;
        }
        html = `<h2 class="slide-title-sm">${esc(slide.title)}</h2>${slide.description?`<p class="quiz-desc">${esc(slide.description)}</p>`:''}<div class="quiz-container">${qHtml}<button class="btn-primary quiz-submit" onclick="submitQuiz()">Rätta quiz</button></div><div id="quizResults" style="display:none"></div>`;
      }
      slidesHtml += `<div class="slide${slideIndex===0?' active':''}" data-index="${slideIndex}">${html}</div>`;
      slideIndex++;
    }
    moduleMap.push({ title: mod.title, type: mod.type, startSlide, endSlide: slideIndex - 1,
      ...(mod.type === 'quiz' ? { passing_score: mod.passing_score || 80 } : {})
    });
  }

  // Build quiz data separately for the JS runtime
  let quizQuestions = [];
  let quizPassingScore = 80;
  for (const mod of course.modules) {
    if (mod.type === 'quiz') {
      quizPassingScore = mod.passing_score || 80;
      for (const slide of (mod.slides || [])) {
        if (slide.type === 'quiz') {
          for (const q of (slide.questions || [])) {
            quizQuestions.push({ question: q.question, options: q.options, correct: q.correct_index });
          }
        }
      }
    }
  }

  const courseJson = JSON.stringify({ ...course, modules: moduleMap, quiz: { questions: quizQuestions, passingScore: quizPassingScore } });

  return `<!DOCTYPE html><html lang="${course.language||'sv'}"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(course.title)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@500;600;700&display=swap" rel="stylesheet">
<style>
:root{--p:${pColor};--p-rgb:${hexToRgb(pColor)};--a:${aColor};--bg:#fafbfc;--surface:#fff;--text:#0f172a;--text-secondary:#475569;--text-muted:#94a3b8;--border:#e2e8f0;--border-light:#f1f5f9;--radius:14px;--shadow-sm:0 1px 2px rgba(0,0,0,0.04);--shadow:0 4px 16px rgba(0,0,0,0.06);--shadow-lg:0 12px 40px rgba(0,0,0,0.08)}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Inter',system-ui,-apple-system,sans-serif;background:var(--bg);color:var(--text);-webkit-font-smoothing:antialiased;font-size:15px;line-height:1.7}
::selection{background:rgba(var(--p-rgb),.12)}
.course-container{max-width:1200px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column;background:var(--surface);box-shadow:var(--shadow-lg)}

/* Header */
.course-header{background:linear-gradient(135deg,var(--p),color-mix(in srgb,var(--p),#000 18%));color:#fff;padding:20px 32px;display:flex;align-items:center;justify-content:space-between;position:relative;overflow:hidden}
.course-header::after{content:'';position:absolute;top:-50%;right:-10%;width:300px;height:300px;background:radial-gradient(circle,rgba(255,255,255,.08),transparent 70%);pointer-events:none}
.course-header h1{font-family:'Playfair Display',Georgia,serif;font-size:20px;font-weight:600;letter-spacing:-.01em;position:relative;z-index:1}
.header-progress{display:flex;align-items:center;gap:14px;font-size:12px;font-weight:600;letter-spacing:.03em;position:relative;z-index:1}
.progress-bar-container{width:140px;height:5px;background:rgba(255,255,255,.18);border-radius:3px;overflow:hidden}
.progress-bar-fill{height:100%;background:#fff;border-radius:3px;transition:width .4s cubic-bezier(.4,0,.2,1)}

/* Body layout */
.course-body{display:flex;flex:1;min-height:0}

/* Sidebar */
.sidebar{width:260px;background:#fff;border-right:1px solid var(--border);padding:24px 0;overflow-y:auto;flex-shrink:0}
.sidebar-label{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--text-muted);padding:0 24px;margin-bottom:16px}
.module-item{padding:12px 24px;display:flex;align-items:center;gap:12px;cursor:pointer;font-size:13px;font-weight:500;transition:all .2s;border-left:3px solid transparent;color:var(--text-secondary)}
.module-item:hover{background:var(--border-light);color:var(--text)}
.module-item.active{background:rgba(var(--p-rgb),.04);border-left-color:var(--p);color:var(--p);font-weight:600}
.module-item.completed .module-icon{background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;box-shadow:0 2px 8px rgba(34,197,94,.2)}
.module-icon{width:30px;height:30px;border-radius:10px;background:var(--border-light);display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex-shrink:0;transition:all .2s}

/* Content */
.content-area{flex:1;padding:48px 56px;overflow-y:auto;max-height:calc(100vh - 140px)}
.slide{display:none;max-width:680px;margin:0 auto}
.slide.active{display:block;animation:slideIn .4s cubic-bezier(.4,0,.2,1)}
@keyframes slideIn{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}

/* Slide titles */
.slide-center{text-align:center;padding:32px 0}
.slide-title{font-family:'Playfair Display',Georgia,serif;font-size:32px;font-weight:600;margin-bottom:12px;letter-spacing:-.02em;line-height:1.2}
.slide-subtitle{font-size:16px;color:var(--text-muted);max-width:520px;margin:0 auto;line-height:1.7}
.slide-title-sm{font-family:'Playfair Display',Georgia,serif;font-size:24px;font-weight:600;margin-bottom:20px;letter-spacing:-.01em;line-height:1.3;padding-bottom:16px;border-bottom:2px solid var(--border-light)}

/* Content blocks */
.block-text{font-size:15px;line-height:1.8;margin-bottom:16px;color:var(--text-secondary)}
.block-heading{font-size:17px;font-weight:700;margin:28px 0 12px;color:var(--text);letter-spacing:-.01em}
.block-bullets{padding-left:0;margin-bottom:20px;list-style:none}
.block-bullets li{font-size:15px;line-height:1.8;margin-bottom:10px;color:var(--text-secondary);padding-left:24px;position:relative}
.block-bullets li::before{content:'';position:absolute;left:2px;top:10px;width:6px;height:6px;border-radius:50%;background:var(--p);opacity:.5}
.block-info{background:rgba(var(--p-rgb),.04);border-left:3px solid var(--p);padding:18px 22px;border-radius:0 var(--radius) var(--radius) 0;margin:20px 0;font-size:14px;color:color-mix(in srgb,var(--p),#000 30%);line-height:1.7}
.block-warning{background:#fffbeb;border-left:3px solid var(--a);padding:18px 22px;border-radius:0 var(--radius) var(--radius) 0;margin:20px 0;font-size:14px;color:#92400e;line-height:1.7}
.block-keypoint{background:linear-gradient(135deg,rgba(var(--p-rgb),.03),rgba(var(--p-rgb),.06));border:1px solid rgba(var(--p-rgb),.1);border-radius:var(--radius);padding:20px 24px;margin:24px 0}
.kp-label{font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:var(--p);margin-bottom:8px;font-weight:700}
.block-keypoint p{color:var(--text);font-weight:500}

/* Scenarios */
.scenario-desc{font-size:15px;color:var(--text-secondary);line-height:1.8;margin-bottom:20px}
.scenario-options{display:flex;flex-direction:column;gap:10px}
.scenario-option{padding:16px 22px;border:2px solid var(--border);border-radius:var(--radius);background:var(--surface);font-size:14px;cursor:pointer;text-align:left;transition:all .25s;font-weight:500;line-height:1.6}
.scenario-option:hover{border-color:var(--p);background:rgba(var(--p-rgb),.03);transform:translateX(4px)}
.scenario-option.correct{border-color:#22c55e;background:#f0fdf4;box-shadow:0 0 0 1px #22c55e}
.scenario-option.incorrect{border-color:#ef4444;background:#fef2f2;box-shadow:0 0 0 1px #ef4444}
.scenario-feedback{display:none;padding:18px 22px;border-radius:var(--radius);margin-top:16px;font-size:14px;line-height:1.7}
.scenario-feedback.show{display:block}
.scenario-feedback.correct{background:#f0fdf4;color:#166534;border:1px solid #bbf7d0}
.scenario-feedback.incorrect{background:#fef2f2;color:#991b1b;border:1px solid #fecaca}

/* Summary */
.summary-list{padding-left:0;margin-bottom:20px;list-style:none;counter-reset:summary}
.summary-list li{font-size:15px;line-height:1.8;margin-bottom:12px;color:var(--text-secondary);padding:12px 18px 12px 52px;position:relative;background:var(--border-light);border-radius:10px;counter-increment:summary}
.summary-list li::before{content:counter(summary);position:absolute;left:14px;top:12px;width:26px;height:26px;border-radius:8px;background:var(--p);color:#fff;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:700}

/* Quiz */
.quiz-desc{font-size:15px;color:var(--text-muted);margin-bottom:28px;line-height:1.7}
.quiz-q{margin-bottom:32px;padding-bottom:32px;border-bottom:1px solid var(--border-light)}
.quiz-q:last-of-type{border-bottom:none}
.quiz-question{font-size:15px;font-weight:600;margin-bottom:14px;line-height:1.5}
.q-num{color:var(--p);font-weight:700;margin-right:2px}
.quiz-options{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.quiz-option{padding:14px 18px;border:2px solid var(--border);border-radius:12px;background:var(--surface);font-size:14px;cursor:pointer;text-align:left;transition:all .2s;font-weight:500}
.quiz-option:hover{border-color:var(--p);background:rgba(var(--p-rgb),.03)}
.quiz-option.selected{border-color:var(--p);background:rgba(var(--p-rgb),.06);font-weight:600;box-shadow:0 0 0 1px var(--p)}
.btn-primary{padding:16px 36px;background:linear-gradient(135deg,var(--p),color-mix(in srgb,var(--p),#000 12%));color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:600;cursor:pointer;transition:all .2s;box-shadow:0 4px 16px rgba(var(--p-rgb),.2)}
.btn-primary:hover{transform:translateY(-1px);box-shadow:0 6px 24px rgba(var(--p-rgb),.25)}
.quiz-submit{margin-top:28px;width:100%}
.quiz-results{text-align:center;padding:48px 0}
.quiz-results h2{font-family:'Playfair Display',Georgia,serif;font-size:24px;font-weight:600}
.result-score{font-size:72px;font-weight:800;margin:20px 0;letter-spacing:-.04em}
.result-score.passed{color:#22c55e}.result-score.failed{color:#ef4444}
.result-badge{display:inline-block;padding:10px 28px;border-radius:50px;font-size:14px;font-weight:700;letter-spacing:.02em}
.result-badge.passed{background:#f0fdf4;color:#166534;border:2px solid #22c55e}
.result-badge.failed{background:#fef2f2;color:#991b1b;border:2px solid #ef4444}

/* Navigation */
.nav-footer{display:flex;justify-content:space-between;align-items:center;padding:16px 32px;background:var(--surface);border-top:1px solid var(--border)}
.nav-btn{padding:11px 24px;font-size:13px;font-weight:600;border-radius:10px;cursor:pointer;border:none;transition:all .2s;letter-spacing:.01em}
.nav-btn.primary{background:var(--p);color:#fff;box-shadow:0 2px 8px rgba(var(--p-rgb),.15)}
.nav-btn.primary:hover{box-shadow:0 4px 16px rgba(var(--p-rgb),.25)}
.nav-btn.secondary{background:var(--border-light);color:var(--text-secondary);border:1px solid var(--border)}
.nav-btn.secondary:hover{background:var(--border);color:var(--text)}
.nav-btn:disabled{opacity:.25;cursor:default;transform:none!important;box-shadow:none!important}
.slide-counter{font-size:12px;color:var(--text-muted);font-weight:600;letter-spacing:.04em}

/* Video */
.video-wrapper video{border-radius:var(--radius);box-shadow:var(--shadow-lg)}

/* Responsive */
@media(max-width:768px){.sidebar{display:none}.content-area{padding:28px 20px}.quiz-options{grid-template-columns:1fr}.course-header{padding:16px 20px}.course-header h1{font-size:16px}.nav-footer{padding:12px 16px}.slide-title{font-size:24px}}
</style>
</head>
<body>
<div class="course-container">
<div class="course-header"><h1>${esc(course.title)}</h1><div class="header-progress"><span id="progressText">0%</span><div class="progress-bar-container"><div class="progress-bar-fill" id="progressBar" style="width:0%"></div></div></div></div>
<div class="course-body"><div class="sidebar" id="sidebar"><div class="sidebar-label">Innehåll</div></div><div class="content-area" id="contentArea">${slidesHtml}</div></div>
<div class="nav-footer"><button class="nav-btn secondary" id="prevBtn" onclick="navigate(-1)">← Föregående</button><span class="slide-counter" id="slideCounter"></span><button class="nav-btn primary" id="nextBtn" onclick="navigate(1)">Nästa →</button></div>
</div>
<script src="scorm_api.js"><\/script>
<script>
var courseData=${courseJson};var totalSlides=document.querySelectorAll('.slide').length;var currentSlide=0;var completedSlides={};var quizAnswers={};var quizSubmitted=false;(function(){SCORM.init();var s=SCORM.getLocation();if(s&&parseInt(s)>0)currentSlide=parseInt(s);var d=SCORM.getSuspendData();if(d){completedSlides=d.completedSlides||{};quizAnswers=d.quizAnswers||{};quizSubmitted=d.quizSubmitted||false}buildSidebar();showSlide(currentSlide)})();function buildSidebar(){var sb=document.getElementById('sidebar');var h='';var ms=courseData.modules;for(var m=0;m<ms.length;m++){var mod=ms[m];var c=true;for(var s=mod.startSlide;s<=mod.endSlide;s++){if(!completedSlides[s]){c=false;break}}h+='<div class="module-item'+(c?' completed':'')+'" data-slide="'+mod.startSlide+'" onclick="goToSlide('+mod.startSlide+')"><div class="module-icon">'+(c?'✓':(m+1))+'</div><span>'+mod.title+'</span></div>'}sb.innerHTML=h}function showSlide(i){if(i<0||i>=totalSlides)return;var sl=document.querySelectorAll('.slide');for(var j=0;j<sl.length;j++)sl[j].classList.remove('active');sl[i].classList.add('active');currentSlide=i;completedSlides[i]=true;var vc=Object.keys(completedSlides).length;var p=Math.round((vc/totalSlides)*100);document.getElementById('progressBar').style.width=p+'%';document.getElementById('progressText').textContent=p+'%';document.getElementById('slideCounter').textContent=(i+1)+' / '+totalSlides;document.getElementById('prevBtn').disabled=(i===0);var nb=document.getElementById('nextBtn');if(i===totalSlides-1){nb.textContent='Avsluta kurs';nb.onclick=function(){finishCourse()}}else{nb.textContent='Nästa →';nb.onclick=function(){navigate(1)}}var items=document.querySelectorAll('.module-item');for(var j=0;j<items.length;j++){items[j].classList.remove('active');var mod=courseData.modules[j];if(mod&&currentSlide>=mod.startSlide&&currentSlide<=mod.endSlide)items[j].classList.add('active')}SCORM.setLocation(i);SCORM.setSuspendData({completedSlides:completedSlides,quizAnswers:quizAnswers,quizSubmitted:quizSubmitted});buildSidebar()}function navigate(d){showSlide(currentSlide+d)}function goToSlide(i){showSlide(i)}function handleScenario(btn,ok,fid){var p=btn.parentElement;var os=p.querySelectorAll('.scenario-option');for(var i=0;i<os.length;i++){os[i].disabled=true;os[i].style.cursor='default'}btn.classList.add(ok?'correct':'incorrect');var f=document.getElementById(fid);if(f){var fb=btn.getAttribute('data-feedback')||'';f.innerHTML=fb;f.className='scenario-feedback show '+(ok?'correct':'incorrect')}}function selectQuizAnswer(qi,oi){if(quizSubmitted)return;quizAnswers[qi]=oi;var os=document.querySelectorAll('#quiz-q-'+qi+' .quiz-option');for(var i=0;i<os.length;i++)os[i].classList.remove('selected');os[oi].classList.add('selected');SCORM.setSuspendData({completedSlides:completedSlides,quizAnswers:quizAnswers,quizSubmitted:quizSubmitted})}function submitQuiz(){var qs=courseData.quiz.questions;var t=qs.length;var c=0;for(var i=0;i<t;i++){if(quizAnswers[i]===qs[i].correct)c++}var s=Math.round((c/t)*100);var p=s>=courseData.quiz.passingScore;quizSubmitted=true;SCORM.setScore(s,100,0);SCORM.setComplete(p);var r=document.getElementById('quizResults');if(r){r.innerHTML='<div class="quiz-results"><h2>Ditt resultat</h2><div class="result-score '+(p?'passed':'failed')+'">'+s+'%</div><div class="result-badge '+(p?'passed':'failed')+'">'+(p?'✓ Godkänd!':'✗ Ej godkänd')+'</div><p>'+c+' av '+t+' rätt. '+(p?'Grattis!':'Du behöver minst '+courseData.quiz.passingScore+'%.')+'</p>'+(p?'':'<button class="nav-btn primary" onclick="retryQuiz()" style="margin-top:16px">Försök igen</button>')+'</div>';r.style.display='block'}SCORM.setSuspendData({completedSlides:completedSlides,quizAnswers:quizAnswers,quizSubmitted:quizSubmitted})}function retryQuiz(){quizAnswers={};quizSubmitted=false;var os=document.querySelectorAll('.quiz-option');for(var i=0;i<os.length;i++)os[i].classList.remove('selected');var r=document.getElementById('quizResults');if(r)r.style.display='none';for(var m=0;m<courseData.modules.length;m++){if(courseData.modules[m].type==='quiz'){goToSlide(courseData.modules[m].startSlide);break}}}function finishCourse(){if(!quizSubmitted){SCORM.setComplete(true)}SCORM.terminate();try{document.querySelector('.content-area').innerHTML='<div style=\"text-align:center;padding:60px 20px\"><h2 style=\"font-size:24px;margin-bottom:12px\">✓ Utbildningen är avslutad!</h2><p style=\"color:#64748b\">Du kan nu stänga detta fönster.</p></div>'}catch(e){}}window.addEventListener('beforeunload',function(){SCORM.terminate()});
<\/script>
</body></html>`;
}

const SCORM_API_JS = `var SCORM=(function(){var api=null;var initialized=false;function findAPI(w){var a=0;while(w&&!w.API_1484_11&&a<10){if(w.parent&&w.parent!==w)w=w.parent;else if(w.opener)w=w.opener;else break;a++}return w?w.API_1484_11||null:null}function getAPI(){if(api)return api;api=findAPI(window);if(!api&&window.opener)api=findAPI(window.opener);if(!api&&window.parent)api=findAPI(window.parent);return api}return{init:function(){var a=getAPI();if(a){var r=a.Initialize("");initialized=r==="true"||r===true;if(initialized){a.SetValue("cmi.completion_status","incomplete");a.SetValue("cmi.success_status","unknown");a.SetValue("cmi.exit","suspend");a.Commit("")}}else{console.log("[SCORM Debug] Standalone mode");initialized=true}return initialized},setValue:function(k,v){var a=getAPI();if(a&&initialized){a.SetValue(k,String(v));a.Commit("");return true}return false},getValue:function(k){var a=getAPI();if(a&&initialized)return a.GetValue(k);return""},setScore:function(s,mx,mn){this.setValue("cmi.score.raw",s);this.setValue("cmi.score.max",mx||100);this.setValue("cmi.score.min",mn||0);this.setValue("cmi.score.scaled",s/(mx||100))},setComplete:function(p){this.setValue("cmi.completion_status","completed");this.setValue("cmi.success_status",p?"passed":"failed")},setSuspendData:function(d){this.setValue("cmi.suspend_data",JSON.stringify(d))},getSuspendData:function(){var r=this.getValue("cmi.suspend_data");try{return r?JSON.parse(r):null}catch(e){return null}},setLocation:function(l){this.setValue("cmi.location",String(l))},getLocation:function(){return this.getValue("cmi.location")},terminate:function(){var a=getAPI();if(a&&initialized){a.SetValue("cmi.exit","suspend");a.Commit("");a.Terminate("");initialized=false}}}})();`;

async function createScormZip(course) {
  if (!window.JSZip) {
    await new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js';
      s.onload = resolve; s.onerror = reject;
      document.head.appendChild(s);
    });
  }
  const zip = new window.JSZip();
  zip.file("imsmanifest.xml", generateImsManifest(course));
  zip.file("index.html", generateCourseHtml(course));
  zip.file("scorm_api.js", SCORM_API_JS);
  return await zip.generateAsync({ type: "blob" });
}

// ─── AI System Prompt ───
const SYSTEM_PROMPT = `Du är en expert på instruktionsdesign och e-utbildningar. Skapa en komplett kursstruktur i JSON-format baserat på användarens beskrivning. Svara ENBART med valid JSON, ingen annan text, inga markdown-backticks.

Generera JSON med denna struktur:
{"id":"unikt_id","title":"Titel","description":"Beskrivning","language":"sv","theme":{"primary":"#1a56db","primary_light":"#eff6ff","accent":"#f59e0b","bg":"#f8fafc","text":"#1e293b","text_muted":"#64748b","card_bg":"#ffffff","border":"#e2e8f0"},"modules":[...]}

Moduler har: title, type (intro/lesson/quiz), passing_score (bara quiz), slides (array).

Slide-typer:
1. title: {type:"title", title:"", subtitle:"", image_prompt:"kort bildbeskrivning på engelska för AI-bildgenerering, professionell utbildningsstil"}
2. content: {type:"content", title:"", blocks:[{type:"text|heading|bullets|info|warning|keypoint", content:"", items:[]}]}
3. scenario: {type:"scenario", title:"", scenario_title:"", scenario_description:"", options:[{text:"", correct:bool, feedback:""}]}
4. summary: {type:"summary", title:"", points:[]}
5. quiz: {type:"quiz", title:"", description:"", questions:[{question:"", options:["A","B","C","D"], correct_index:0}]}

Regler:
- Börja med intro-modul (title slide + varför-slide)
- Varje lektion: 2-4 slides, blanda content + scenario
- Summary-slide före quiz
- Quiz: 8-15 frågor, 4 alternativ, default 80% godkänt
- Realistiska arbetsplatsscenarier
- Du-tilltal, konkret och handlingsbart
- 2-3 slides per 5 minuter
- Skriv på samma språk som användaren`;

// ─── Main App Component ───
const themes = [
  { name: "Midnight", primary: "#2563eb", primary_light: "#eff6ff", accent: "#f59e0b" },
  { name: "Emerald", primary: "#059669", primary_light: "#ecfdf5", accent: "#f97316" },
  { name: "Plum", primary: "#7c3aed", primary_light: "#f5f3ff", accent: "#ec4899" },
  { name: "Graphite", primary: "#334155", primary_light: "#f1f5f9", accent: "#06b6d4" },
];

export default function ScormStudioApp() {
  // ── Load persisted state from localStorage ──
  const loadPersisted = (key, fallback) => {
    try {
      const saved = localStorage.getItem(`scorm_${key}`);
      return saved ? JSON.parse(saved) : fallback;
    } catch { return fallback; }
  };

  const [step, setStep] = useState(() => loadPersisted('step', 'describe'));
  const [prompt, setPrompt] = useState(() => loadPersisted('prompt', ''));
  const [course, setCourse] = useState(() => loadPersisted('course', null));
  const [error, setError] = useState(null);
  const [genProgress, setGenProgress] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(() => loadPersisted('theme', 0));
  const [expandedMod, setExpandedMod] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [themeMode, setThemeMode] = useState(() => loadPersisted('themeMode', 'dark'));
  const [generateImages, setGenerateImages] = useState(false);
  const [imageProgress, setImageProgress] = useState('');
  const [editInput, setEditInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editHistory, setEditHistory] = useState(() => loadPersisted('editHistory', []));
  const [showPreview, setShowPreview] = useState(false);
  const [previewSlide, setPreviewSlide] = useState(0);
  const [scenarioAnswers, setScenarioAnswers] = useState({});
  const [quizSelections, setQuizSelections] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [showAiEdit, setShowAiEdit] = useState(false);
  const [aiEditPrompt, setAiEditPrompt] = useState('');
  const [aiEditing, setAiEditing] = useState(false);
  const [aiEditSuccess, setAiEditSuccess] = useState('');
  const [shareStatus, setShareStatus] = useState(''); // '' | 'sharing' | 'done' | 'error'
  const [shareUrl, setShareUrl] = useState('');

  // ── HeyGen Video Avatar State ──
  const [useVideo, setUseVideo] = useState(false);
  const [heygenAvatars, setHeygenAvatars] = useState([]);
  const [heygenVoices, setHeygenVoices] = useState([]);
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [heygenLoading, setHeygenLoading] = useState(false);
  const [heygenError, setHeygenError] = useState('');
  const [videoJobs, setVideoJobs] = useState(() => loadPersisted('videoJobs', []));
  const [videoStep, setVideoStep] = useState(() => loadPersisted('videoStep', ''));

  // ── Saved Courses Library ──
  const [savedCourses, setSavedCourses] = useState(() => loadPersisted('savedCourses', []));
  const [showLibrary, setShowLibrary] = useState(false);

  // Auto-save course to library when entering review step
  useEffect(() => {
    if (step === 'review' && course && course.title) {
      setSavedCourses(prev => {
        const courseId = course.id || course.title;
        // Update existing or add new
        const existing = prev.findIndex(c => c.id === courseId);
        const entry = {
          id: courseId,
          title: course.title,
          description: course.description,
          moduleCount: course.modules?.length || 0,
          slideCount: course.modules?.reduce((sum, m) => sum + (m.slides?.length || 0), 0) || 0,
          hasVideo: course.modules?.some(m => m.video_url) || false,
          savedAt: new Date().toISOString(),
          course: course,
          videoJobs: videoJobs,
          prompt: prompt
        };
        if (existing >= 0) {
          const updated = [...prev];
          updated[existing] = entry;
          return updated;
        }
        return [entry, ...prev];
      });
    }
  }, [step, course, videoJobs, prompt]);

  // Persist saved courses
  useEffect(() => {
    try {
      localStorage.setItem('scorm_savedCourses', JSON.stringify(savedCourses));
    } catch { /* localStorage full */ }
  }, [savedCourses]);

  // Load a saved course
  const loadSavedCourse = useCallback((entry) => {
    setCourse(entry.course);
    setVideoJobs(entry.videoJobs || []);
    setVideoStep(entry.videoJobs?.length > 0 ? 'done' : '');
    setPrompt(entry.prompt || '');
    setEditHistory([]);
    setStep('review');
    setShowLibrary(false);
    setShowPreview(false);
    setPreviewSlide(0);
  }, []);

  // Delete a saved course
  const deleteSavedCourse = useCallback((id) => {
    setSavedCourses(prev => prev.filter(c => c.id !== id));
  }, []);

  // ── Persist key state to localStorage ──
  useEffect(() => {
    try {
      localStorage.setItem('scorm_step', JSON.stringify(step));
      localStorage.setItem('scorm_prompt', JSON.stringify(prompt));
      localStorage.setItem('scorm_theme', JSON.stringify(selectedTheme));
      localStorage.setItem('scorm_themeMode', JSON.stringify(themeMode));
      localStorage.setItem('scorm_editHistory', JSON.stringify(editHistory));
      localStorage.setItem('scorm_videoJobs', JSON.stringify(videoJobs));
      localStorage.setItem('scorm_videoStep', JSON.stringify(videoStep));
    } catch { /* localStorage full or unavailable */ }
  }, [step, prompt, selectedTheme, themeMode, editHistory, videoJobs, videoStep]);

  // Course saved separately (can be large with base64 images)
  useEffect(() => {
    try {
      if (course) {
        localStorage.setItem('scorm_course', JSON.stringify(course));
      } else {
        localStorage.removeItem('scorm_course');
      }
    } catch { /* too large */ }
  }, [course]);

  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);

  // Detect if running inside Claude.ai artifact (no API key needed)
  const isArtifact = typeof window !== 'undefined' && (
    window.location.hostname.includes('claude') ||
    window.location.hostname.includes('anthropic') ||
    window.parent !== window // iframe = likely artifact
  );

  // ── Load shared course from URL if ?kurs=... ──
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const kursId = params.get('kurs');
    if (!kursId) return;

    setGenProgress('Laddar delad kurs...');
    setStep('generating');
    fetch(`/api/shared?id=${kursId}`)
      .then(r => {
        if (!r.ok) throw new Error('Kursen hittades inte.');
        return r.json();
      })
      .then(data => {
        if (data.course) {
          setCourse(data.course);
          if (data.videoJobs) {
            setVideoJobs(data.videoJobs);
            setVideoStep('done');
          }
          setStep('review');
          window.history.replaceState({}, '', window.location.pathname);
        } else {
          throw new Error('Ingen kurs i länken.');
        }
      })
      .catch(err => {
        setError('Kunde inte ladda delad kurs: ' + err.message);
        setStep('describe');
      });
  }, []);

  // Helper: make AI call via server proxy (standalone) or direct Anthropic (artifact)
  const callClaude = useCallback(async (system, userMessage, options = {}) => {
    const { model } = options;

    if (isArtifact) {
      // Artifact mode: call Anthropic directly (auth handled by Claude.ai)
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: model || "claude-sonnet-4-20250514", max_tokens: 16000,
          system, messages: [{ role: "user", content: userMessage }]
        })
      });
      if (!response.ok) throw new Error(`API-fel (${response.status}).`);
      return await response.json();
    }

    // Standalone mode: use server-side proxy → /api/chat
    // API key lives safely on the server (OPENROUTER_API_KEY env var)
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ system, message: userMessage, model: model || undefined })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error || `API-fel (${response.status}).`);
    }

    return await response.json();
  }, [isArtifact]);

  // ── HeyGen: Fetch avatars & voices when video mode enabled ──
  useEffect(() => {
    if (!useVideo || isArtifact || heygenAvatars.length > 0) return;
    setHeygenLoading(true);
    setHeygenError('');
    Promise.all([
      fetch('/api/heygen/avatars').then(r => r.json()),
      fetch('/api/heygen/voices').then(r => r.json())
    ]).then(([avatarData, voiceData]) => {
      if (avatarData.error) throw new Error(avatarData.error);
      if (voiceData.error) throw new Error(voiceData.error);
      setHeygenAvatars(avatarData.avatars || []);
      const svVoices = (voiceData.voices || []).filter(v =>
        v.language?.toLowerCase().includes('swedish') || v.language?.toLowerCase().includes('sv')
      );
      const enVoices = (voiceData.voices || []).filter(v =>
        v.language?.toLowerCase().includes('english') || v.language?.toLowerCase().includes('en')
      );
      setHeygenVoices([...svVoices, ...enVoices].slice(0, 20));
    }).catch(err => {
      setHeygenError(err.message || 'Kunde inte hämta HeyGen-data.');
    }).finally(() => setHeygenLoading(false));
  }, [useVideo, isArtifact, heygenAvatars.length]);

  // ── HeyGen: Generate videos for course modules ──
  // NOTE: testMode = true → only says the module title (saves HeyGen credits)
  const testMode = false;

  const startVideoGeneration = useCallback(async (courseData) => {
    if (!selectedAvatar || !selectedVoice || !courseData) return [];
    setVideoStep('generating');

    // Build scripts from module content — keep original module index!
    const modulesWithScripts = courseData.modules
      .map((mod, originalIndex) => {
        if (mod.type === 'quiz') return null; // skip quiz modules
        let script = '';
        if (testMode) {
          script = `Välkommen till modulen: ${mod.title}.`;
        } else {
          for (const slide of (mod.slides || [])) {
            if (slide.type === 'title') {
              script += `${slide.title}. ${slide.subtitle || ''} `;
            } else if (slide.type === 'content') {
              for (const block of (slide.blocks || [])) {
                if (block.type === 'text' || block.type === 'heading' || block.type === 'keypoint') {
                  script += `${block.content} `;
                } else if (block.type === 'bullets' && block.items) {
                  script += block.items.join('. ') + '. ';
                }
              }
            } else if (slide.type === 'summary' && slide.points) {
              script += 'Sammanfattningsvis: ' + slide.points.join('. ') + '. ';
            }
          }
        }
        console.log(`[HeyGen] Module ${originalIndex}: "${mod.title}" (${mod.type}) → script: "${script.substring(0, 50)}..."`);
        return { moduleIndex: originalIndex, title: mod.title, script: script.trim() };
      })
      .filter(m => m && m.script.length > 5);
    
    console.log('[HeyGen] Modules to generate videos for:', modulesWithScripts.map(m => `idx=${m.moduleIndex} "${m.title}"`).join(', '));

    const jobs = [];

    for (let i = 0; i < modulesWithScripts.length; i++) {
      const mod = modulesWithScripts[i];
      setGenProgress(`Startar video ${i + 1}/${modulesWithScripts.length}: ${mod.title}...`);

      try {
        const resp = await fetch('/api/heygen/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            script: mod.script,
            avatar_id: selectedAvatar,
            voice_id: selectedVoice
          })
        });
        const data = await resp.json();
        if (data.error) throw new Error(data.error);

        jobs.push({
          moduleIndex: mod.moduleIndex,
          title: mod.title,
          videoId: data.video_id,
          status: 'processing',
          videoUrl: null,
          duration: null
        });
      } catch (err) {
        jobs.push({
          moduleIndex: mod.moduleIndex,
          title: mod.title,
          videoId: null,
          status: 'failed',
          error: err.message
        });
      }
    }

    setVideoJobs(jobs);
    return jobs;
  }, [selectedAvatar, selectedVoice]);

  // ── HeyGen: Poll video jobs in background (runs from review screen) ──
  const courseRef = useRef(null);
  // Keep ref in sync with state
  useEffect(() => { courseRef.current = course; }, [course]);

  const pollVideoJobs = useCallback(async (jobs) => {
    const pollInterval = 5000;
    const maxWait = 600000;
    const startTime = Date.now();

    while (Date.now() - startTime < maxWait) {
      await new Promise(r => setTimeout(r, pollInterval));

      let anyChanged = false;
      for (const job of jobs) {
        if (job.status !== 'processing') continue;
        try {
          const resp = await fetch(`/api/heygen/status?video_id=${job.videoId}`);
          const data = await resp.json();
          if (data.status === 'completed') {
            job.status = 'completed';
            job.videoUrl = data.video_url;
            job.duration = data.duration;
            anyChanged = true;
          } else if (data.status === 'failed') {
            job.status = 'failed';
            job.error = data.error;
            anyChanged = true;
          }
        } catch (err) { /* keep polling */ }
      }

      setVideoJobs([...jobs]);

      // Deep-update course with new video URLs
      if (anyChanged && courseRef.current) {
        setCourse(prev => {
          if (!prev) return prev;
          const updated = JSON.parse(JSON.stringify(prev)); // deep clone
          for (const job of jobs) {
            if (job.status === 'completed' && job.videoUrl && updated.modules[job.moduleIndex]) {
              console.log(`[HeyGen] Attaching video to module ${job.moduleIndex} (${job.title}): ${job.videoUrl.substring(0, 80)}...`);
              updated.modules[job.moduleIndex].video_url = job.videoUrl;
              updated.modules[job.moduleIndex].video_duration = job.duration;
            }
          }
          // Log final state
          console.log('[HeyGen] Modules with video:', updated.modules.map((m, i) => `${i}:${m.title}=${m.video_url ? 'YES' : 'no'}`).join(', '));
          return updated;
        });
      }

      if (jobs.every(j => j.status === 'completed' || j.status === 'failed')) {
        setVideoStep('done');
        return;
      }
    }
    setVideoStep('done');
  }, []);

  const [systemDark, setSystemDark] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return;
    setSystemDark(mq.matches);
    const handler = (e) => setSystemDark(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemDark);

  // ── Premium Design Tokens ──
  const t = isDark ? {
    bg: '#08090d',
    bgSoft: 'rgba(255,255,255,0.025)',
    bgCard: 'rgba(255,255,255,0.035)',
    bgCardHover: 'rgba(255,255,255,0.055)',
    bgInput: 'rgba(255,255,255,0.04)',
    bgHover: 'rgba(99,102,241,0.06)',
    border: 'rgba(255,255,255,0.06)',
    borderLight: 'rgba(255,255,255,0.04)',
    borderHover: 'rgba(99,102,241,0.25)',
    borderInput: 'rgba(255,255,255,0.08)',
    text: '#f0f1f3',
    textSecondary: '#a0a6b4',
    textMuted: '#5e6578',
    textDim: '#3d4354',
    accent: '#818cf8',
    accentSoft: 'rgba(129,140,248,0.08)',
    accentBorder: 'rgba(129,140,248,0.15)',
    accentText: '#a5b4fc',
    successBg: 'rgba(52,211,153,0.08)',
    successText: '#6ee7b7',
    successBorder: 'rgba(52,211,153,0.15)',
    errorBg: 'rgba(251,113,133,0.08)',
    errorText: '#fda4af',
    errorBorder: 'rgba(251,113,133,0.15)',
    warnBg: 'rgba(251,191,36,0.08)',
    warnText: '#fcd34d',
    warnBorder: 'rgba(251,191,36,0.15)',
    infoBg: 'rgba(129,140,248,0.08)',
    infoText: '#c7d2fe',
    infoBorder: '#818cf8',
    btnSecondaryBg: 'rgba(255,255,255,0.04)',
    btnSecondaryBorder: 'rgba(255,255,255,0.08)',
    scrollbar: 'rgba(129,140,248,0.2)',
    shimmer: 'linear-gradient(110deg, rgba(129,140,248,0.06) 0%, rgba(129,140,248,0.12) 40%, rgba(129,140,248,0.06) 60%)',
  } : {
    bg: '#f5f6f8',
    bgSoft: '#ffffff',
    bgCard: '#ffffff',
    bgCardHover: '#f8f9fb',
    bgInput: '#eef0f4',
    bgHover: 'rgba(37,99,235,0.04)',
    border: '#dfe2e8',
    borderLight: '#eef0f4',
    borderHover: 'rgba(37,99,235,0.25)',
    borderInput: '#c8cdd6',
    text: '#111827',
    textSecondary: '#4b5563',
    textMuted: '#6b7280',
    textDim: '#9ca3af',
    accent: '#2563eb',
    accentSoft: 'rgba(37,99,235,0.06)',
    accentBorder: 'rgba(37,99,235,0.15)',
    accentText: '#1d4ed8',
    successBg: '#ecfdf5',
    successText: '#065f46',
    successBorder: '#a7f3d0',
    errorBg: '#fef2f2',
    errorText: '#991b1b',
    errorBorder: '#fecaca',
    warnBg: '#fffbeb',
    warnText: '#92400e',
    warnBorder: '#fde68a',
    infoBg: '#eff6ff',
    infoText: '#1e40af',
    infoBorder: '#2563eb',
    btnSecondaryBg: '#ffffff',
    btnSecondaryBorder: '#dfe2e8',
    scrollbar: 'rgba(37,99,235,0.2)',
    shimmer: 'linear-gradient(110deg, rgba(37,99,235,0.04) 0%, rgba(37,99,235,0.08) 40%, rgba(37,99,235,0.04) 60%)',
  };

  const generateCourse = useCallback(async () => {
    setStep('generating'); setError(null); setGenProgress('Skickar till AI...');
    try {
      setGenProgress('AI analyserar din beskrivning...');
      const data = await callClaude(
        SYSTEM_PROMPT + "\n\nVIKTIGT: Håll kursen kompakt. Max 3 lektionsmoduler med 2-3 slides vardera. Max 8 quiz-frågor. Totalt max 12 slides. Svara med ENBART JSON.",
        `Skapa en komplett e-utbildning:\n\n${prompt}\n\nSvara ENBART med valid JSON. Börja direkt med { och sluta med }.`
      );
      const wasTruncated = data.stop_reason === 'max_tokens';
      let text = '';
      if (data.content && Array.isArray(data.content)) {
        text = data.content.filter(c => c.type === 'text').map(c => c.text || '').join('').trim();
      }
      if (!text) throw new Error('Tomt svar från AI.');
      setGenProgress('Tolkar kursstruktur...');
      let cleaned = text.replace(/^\s*```(?:json)?\s*\n?/, '').replace(/\n?\s*```\s*$/, '').trim();
      let depth = 0, jsonStart = -1, jsonEnd = -1;
      for (let i = 0; i < cleaned.length; i++) {
        if (cleaned[i] === '{') { if (depth === 0) jsonStart = i; depth++; }
        else if (cleaned[i] === '}') { depth--; if (depth === 0 && jsonStart >= 0) { jsonEnd = i; break; } }
      }
      let parsed;
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        const jsonStr = cleaned.substring(jsonStart, jsonEnd + 1);
        try { parsed = JSON.parse(jsonStr); } catch (e) {
          let fixed = jsonStr.replace(/,\s*}/g, '}').replace(/,\s*\]/g, ']').replace(/[\x00-\x1f]/g, ' ');
          if (wasTruncated) {
            fixed = fixed.replace(/,\s*"[^"]*$/, '').replace(/,\s*\{[^}]*$/, '').replace(/,\s*\[[^\]]*$/, '').replace(/,\s*$/, '');
            let ob = 0, oq = 0, inStr = false;
            for (let ci = 0; ci < fixed.length; ci++) { const ch = fixed[ci]; if (ch === '"' && (ci === 0 || fixed[ci-1] !== '\\')) inStr = !inStr; if (!inStr) { if (ch === '{') ob++; else if (ch === '}') ob--; else if (ch === '[') oq++; else if (ch === ']') oq--; } }
            for (let ci = 0; ci < oq; ci++) fixed += ']';
            for (let ci = 0; ci < ob; ci++) fixed += '}';
          }
          try { parsed = JSON.parse(fixed); } catch (e2) { throw new Error('Kunde inte tolka AI-svaret.'); }
        }
      } else throw new Error('AI-svaret innehöll ingen JSON.');
      if (!parsed.title || !parsed.modules) throw new Error('Ofullständig kurs.');
      const sel = themes[selectedTheme];
      parsed.theme = { ...parsed.theme, primary: sel.primary, primary_light: sel.primary_light, accent: sel.accent, bg: "#f8fafc", text: "#1e293b", text_muted: "#64748b", card_bg: "#ffffff", border: "#e2e8f0" };

      // Generate images for title slides if enabled
      if (generateImages && !isArtifact) {
        const titleSlides = [];
        for (const mod of parsed.modules) {
          for (const slide of (mod.slides || [])) {
            if (slide.type === 'title' && slide.image_prompt) {
              titleSlides.push(slide);
            }
          }
        }
        if (titleSlides.length > 0) {
          setGenProgress(`Genererar bilder (0/${titleSlides.length})...`);
          for (let i = 0; i < titleSlides.length; i++) {
            setGenProgress(`Genererar bild ${i + 1}/${titleSlides.length}...`);
            try {
              const imgResp = await fetch('/api/image', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  prompt: `Create a photorealistic, high-quality photograph for an e-learning course slide. Style: professional stock photography, natural lighting, shallow depth of field, modern workplace setting. Subject: ${titleSlides[i].image_prompt}. No text or overlays in the image. Landscape format 16:9.`
                })
              });
              if (imgResp.ok) {
                const imgData = await imgResp.json();
                if (imgData.image) {
                  titleSlides[i].generated_image = imgData.image;
                }
              }
            } catch (imgErr) {
              console.warn('Image generation failed for slide:', imgErr);
            }
          }
          setGenProgress('Klar!');
        }
      }

      setCourse(parsed);

      // Kick off HeyGen videos (non-blocking — polls in background)
      if (useVideo && selectedAvatar && selectedVoice && !isArtifact) {
        setGenProgress('Startar videor via HeyGen...');
        try {
          const jobs = await startVideoGeneration(parsed);
          // Start polling in background (don't await)
          pollVideoJobs(jobs);
        } catch (err) {
          console.warn('Video generation error:', err);
        }
      }

      setStep('review');
    } catch (err) { setError(err.message); setStep('describe'); }
  }, [prompt, selectedTheme, generateImages, isArtifact, callClaude, useVideo, selectedAvatar, selectedVoice, startVideoGeneration, pollVideoJobs]);

  const handleDownloadScorm = useCallback(async () => {
    if (!course) return; setDownloading(true);
    try {
      const blob = await createScormZip(course);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url;
      a.download = `${(course.id || 'course').replace(/[^a-z0-9_-]/gi,'-')}-SCORM.zip`;
      a.click(); URL.revokeObjectURL(url); setStep('export');
    } catch (err) { setError('Kunde inte skapa SCORM-paket: ' + err.message); }
    setDownloading(false);
  }, [course]);

  const handleAiEditReview = useCallback(async () => {
    if (!editInput.trim() || !course || isEditing) return;
    setIsEditing(true); const instruction = editInput.trim(); setEditInput('');
    try {
      const data = await callClaude(
        `Du är en AI som redigerar e-utbildningar. Du får en befintlig kurs i JSON och en ändringsförfrågan. Returnera den UPPDATERADE kursen som komplett JSON. Svara ENBART med JSON. VIKTIGT: Max 3 lektionsmoduler, max 12 slides.`,
        `Kurs:\n${JSON.stringify(course, null, 0)}\n\nÄndring: ${instruction}\n\nReturnera JSON. Börja med {.`
      );
      let text = (data.content || []).filter(c => c.type === 'text').map(c => c.text || '').join('').trim();
      text = text.replace(/^\s*```(?:json)?\s*\n?/, '').replace(/\n?\s*```\s*$/, '');
      let depth = 0, start = -1, end = -1;
      for (let i = 0; i < text.length; i++) { if (text[i] === '{') { if (depth === 0) start = i; depth++; } else if (text[i] === '}') { depth--; if (depth === 0 && start >= 0) { end = i; break; } } }
      let parsed;
      if (start >= 0 && end > start) {
        let jsonStr = text.substring(start, end + 1);
        try { parsed = JSON.parse(jsonStr); } catch (e) {
          if (data.stop_reason === 'max_tokens') {
            jsonStr = jsonStr.replace(/,\s*"[^"]*$/, '').replace(/,\s*\{[^}]*$/, '').replace(/,\s*$/, '');
            let ob = 0, oq = 0, inStr = false;
            for (let i = 0; i < jsonStr.length; i++) { const c = jsonStr[i]; if (c === '"' && (i === 0 || jsonStr[i-1] !== '\\')) inStr = !inStr; if (!inStr) { if (c === '{') ob++; if (c === '}') ob--; if (c === '[') oq++; if (c === ']') oq--; } }
            for (let i = 0; i < oq; i++) jsonStr += ']'; for (let i = 0; i < ob; i++) jsonStr += '}';
          }
          parsed = JSON.parse(jsonStr);
        }
      } else throw new Error('Kunde inte tolka svaret');
      if (!parsed.title || !parsed.modules) throw new Error('Ofullständig kurs.');
      parsed.theme = course.theme;
      setEditHistory(prev => [...prev, { instruction, timestamp: Date.now() }]);
      setCourse(parsed); setScenarioAnswers({}); setQuizSelections({}); setQuizResult(null);
    } catch (err) { setError('AI-redigering misslyckades: ' + err.message); }
    setIsEditing(false);
  }, [editInput, course, isEditing]);

  // Preview AI edit
  const handleAiEditPreview = useCallback(async () => {
    if (!aiEditPrompt.trim() || !course) return;
    setAiEditing(true); setAiEditSuccess('');
    try {
      const data = await callClaude(
        `Du redigerar e-utbildningar. Returnera UPPDATERAD kurs som JSON. Bara JSON, inga backticks. Max 3 lektionsmoduler, max 12 slides.`,
        `Kurs:\n${JSON.stringify(course, null, 0)}\n\nÄndring: ${aiEditPrompt}\n\nReturnera JSON.`
      );
      let text = (data.content || []).filter(c => c.type === 'text').map(c => c.text || '').join('').trim();
      text = text.replace(/^\s*```(?:json)?\s*\n?/, '').replace(/\n?\s*```\s*$/, '');
      let depth = 0, start = -1, end = -1;
      for (let i = 0; i < text.length; i++) { if (text[i] === '{') { if (depth === 0) start = i; depth++; } else if (text[i] === '}') { depth--; if (depth === 0 && start >= 0) { end = i; break; } } }
      let parsed;
      if (start >= 0 && end > start) {
        let jsonStr = text.substring(start, end + 1);
        try { parsed = JSON.parse(jsonStr); } catch (e) {
          let fixed = jsonStr.replace(/,\s*}/g, '}').replace(/,\s*\]/g, ']');
          if (data.stop_reason === 'max_tokens') {
            fixed = fixed.replace(/,\s*"[^"]*$/, '').replace(/,\s*\{[^}]*$/, '').replace(/,\s*$/, '');
            let ob = 0, oq = 0; let inStr = false;
            for (let ci = 0; ci < fixed.length; ci++) { const ch = fixed[ci]; if (ch === '"' && (ci === 0 || fixed[ci-1] !== '\\')) inStr = !inStr; if (!inStr) { if (ch === '{') ob++; else if (ch === '}') ob--; else if (ch === '[') oq++; else if (ch === ']') oq--; } }
            for (let ci = 0; ci < oq; ci++) fixed += ']'; for (let ci = 0; ci < ob; ci++) fixed += '}';
          }
          parsed = JSON.parse(fixed);
        }
      } else throw new Error('Kunde inte tolka svaret');
      if (!parsed.title || !parsed.modules) throw new Error('Ofullständig kurs');
      parsed.theme = course.theme;
      setCourse(parsed); setAiEditPrompt(''); setAiEditSuccess('Ändring genomförd');
      setScenarioAnswers({}); setQuizSelections({}); setQuizResult(null);
      setTimeout(() => setAiEditSuccess(''), 3000);
    } catch (err) { setError('AI-redigering misslyckades: ' + err.message); }
    setAiEditing(false);
  }, [aiEditPrompt, course]);

  const allSlides = course ? course.modules.flatMap(m => {
    let videoAssigned = false;
    return (m.slides||[]).map((s, si) => {
      // Attach video to the first title slide, or first slide if no title exists
      let videoUrl = null;
      if (m.video_url && !videoAssigned) {
        if (s.type === 'title' || si === 0) {
          videoUrl = m.video_url;
          videoAssigned = true;
        }
      }
      return {...s, moduleName: m.title, moduleType: m.type, moduleVideoUrl: videoUrl};
    });
  }) : [];
  const quizModule = course ? course.modules.find(m => m.type === 'quiz') : null;
  const passingScore = quizModule?.passing_score || 80;

  const handlePreview = useCallback(() => {
    setShowPreview(true); setPreviewSlide(0); setScenarioAnswers({}); setQuizSelections({}); setQuizResult(null);
  }, []);

  const handleQuizSubmit = useCallback(() => {
    if (!course) return;
    let total = 0, correct = 0;
    for (const mod of course.modules) {
      if (mod.type !== 'quiz') continue;
      for (const slide of (mod.slides||[])) {
        if (slide.type !== 'quiz') continue;
        for (let qi = 0; qi < (slide.questions||[]).length; qi++) {
          total++;
          if (quizSelections[qi] === slide.questions[qi].correct_index) correct++;
        }
      }
    }
    const score = total > 0 ? Math.round((correct / total) * 100) : 0;
    setQuizResult({ score, correct, total, passed: score >= passingScore });
  }, [course, quizSelections, passingScore]);

  const totalSlides = course ? course.modules.reduce((sum, m) => sum + (m.slides||[]).length, 0) : 0;
  const totalQuestions = course ? course.modules.reduce((sum, m) => m.type !== 'quiz' ? sum : sum + (m.slides||[]).reduce((s2, sl) => s2 + (sl.questions||[]).length, 0), 0) : 0;
  const totalScenarios = course ? course.modules.reduce((sum, m) => sum + (m.slides||[]).filter(s => s.type === 'scenario').length, 0) : 0;

  // Shared button style helper
  const btnPrimary = (disabled) => ({
    padding: '13px 28px', fontSize: 14, fontWeight: 600, letterSpacing: '0.01em',
    background: disabled ? t.btnSecondaryBg : `linear-gradient(135deg, ${t.accent}, ${isDark ? '#6366f1' : '#1d4ed8'})`,
    border: 'none', borderRadius: 10, color: '#fff', cursor: disabled ? 'default' : 'pointer',
    opacity: disabled ? 0.35 : 1, transition: 'all .25s ease',
    boxShadow: disabled ? 'none' : `0 2px 12px ${isDark ? 'rgba(129,140,248,0.15)' : 'rgba(37,99,235,0.2)'}`,
  });

  const btnSecondary = {
    padding: '13px 24px', fontSize: 14, fontWeight: 600,
    background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 10,
    color: t.text, cursor: 'pointer', transition: 'all .25s ease',
  };

  return (
    <div style={{ minHeight: '100vh', background: t.bg, color: t.text,
      fontFamily: "'DM Sans', 'General Sans', -apple-system, sans-serif",
      transition: 'background .4s ease, color .4s ease', position: 'relative', overflow: 'hidden' }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&family=DM+Serif+Display&display=swap');
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px) } to { opacity:1; transform:translateY(0) } }
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes spin { to { transform:rotate(360deg) } }
        @keyframes shimmer { 0% { background-position:-200% 0 } 100% { background-position:200% 0 } }
        @keyframes pulse { 0%,100% { opacity:.4 } 50% { opacity:1 } }
        @keyframes float { 0%,100% { transform:translateY(0) } 50% { transform:translateY(-6px) } }
        @keyframes glow { 0%,100% { box-shadow: 0 0 20px rgba(129,140,248,0.1) } 50% { box-shadow: 0 0 40px rgba(129,140,248,0.2) } }
        * { box-sizing:border-box; margin:0; padding:0 }
        textarea:focus, input:focus, button:focus { outline:none }
        button:hover { filter: brightness(1.05) }
        ::-webkit-scrollbar { width:5px } ::-webkit-scrollbar-track { background:transparent }
        ::-webkit-scrollbar-thumb { background:${t.scrollbar}; border-radius:3px }
        ::selection { background: ${isDark ? 'rgba(129,140,248,0.3)' : 'rgba(37,99,235,0.15)'} }
      `}</style>

      {/* Ambient background */}
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '50%', height: '50%',
          background: isDark ? 'radial-gradient(ellipse, rgba(99,102,241,0.06) 0%, transparent 70%)' : 'radial-gradient(ellipse, rgba(37,99,235,0.03) 0%, transparent 70%)',
          filter: 'blur(40px)' }} />
        <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '50%', height: '50%',
          background: isDark ? 'radial-gradient(ellipse, rgba(6,182,212,0.04) 0%, transparent 70%)' : 'radial-gradient(ellipse, rgba(6,182,212,0.02) 0%, transparent 70%)',
          filter: 'blur(40px)' }} />
        {/* Subtle grid */}
        <div style={{ position: 'absolute', inset: 0, opacity: isDark ? 0.015 : 0.025,
          backgroundImage: `linear-gradient(${isDark ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,1)'} 1px, transparent 1px), linear-gradient(90deg, ${isDark ? 'rgba(255,255,255,1)' : 'rgba(0,0,0,1)'} 1px, transparent 1px)`,
          backgroundSize: '64px 64px' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 860, margin: '0 auto', padding: '48px 24px' }}>

        {/* ═══ HEADER ═══ */}
        <div style={{ marginBottom: 48, animation: 'fadeUp .6s ease', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 40, height: 40, borderRadius: 12,
              background: `linear-gradient(135deg, ${t.accent}, ${isDark ? '#6366f1' : '#1d4ed8'})`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 4px 16px ${isDark ? 'rgba(129,140,248,0.2)' : 'rgba(37,99,235,0.15)'}` }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 2h14a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z"/><path d="M9 22V2"/><path d="M14 7h4"/><path d="M14 11h4"/>
              </svg>
            </div>
            <div>
              <h1 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, letterSpacing: '-0.01em', color: t.text }}>
                SCORM Studio
              </h1>
              <p style={{ fontSize: 12, color: t.textMuted, marginTop: 1, letterSpacing: '0.04em', fontWeight: 500 }}>AI-DRIVEN KURSBYGGARE</p>
            </div>
          </div>

          {/* Library + AI Status + Theme toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Saved courses button */}
            {!isArtifact && savedCourses.length > 0 && (
              <button onClick={() => setShowLibrary(!showLibrary)}
                style={{ padding: '5px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                  background: showLibrary ? '#7c3aed' : t.bgCard, border: `1px solid ${showLibrary ? '#7c3aed' : t.border}`,
                  color: showLibrary ? '#fff' : t.text, cursor: 'pointer', transition: 'all .2s' }}>
                📚 Mina kurser ({savedCourses.length})
              </button>
            )}

            {/* AI status (only show on standalone) */}
            {!isArtifact && (
              <div style={{ padding: '5px 10px', borderRadius: 8, fontSize: 11, fontWeight: 600,
                background: t.successBg, border: `1px solid ${t.successBorder}`, color: t.successText,
                letterSpacing: '0.02em' }}>
                AI via OpenRouter
              </div>
            )}

            {/* Theme toggle */}
            <div style={{ display: 'flex', gap: 2, background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 10, padding: 3 }}>
            {[
              { mode: 'light', icon: '☀' },
              { mode: 'dark', icon: '●' },
              { mode: 'system', icon: '◐' },
            ].map(({ mode, icon }) => (
              <button key={mode} onClick={() => setThemeMode(mode)}
                style={{ width: 34, height: 30, borderRadius: 8, border: 'none', fontSize: 13, cursor: 'pointer',
                  background: themeMode === mode ? t.accentSoft : 'transparent',
                  color: themeMode === mode ? t.accentText : t.textMuted, transition: 'all .2s' }}>
                {icon}
              </button>
            ))}
          </div>
          </div>
        </div>

        {/* ═══ COURSE LIBRARY ═══ */}
        {showLibrary && (
          <div style={{ marginBottom: 24, background: t.bgCard, border: `1px solid ${t.border}`,
            borderRadius: 16, overflow: 'hidden', animation: 'fadeUp .3s ease',
            boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.06)' }}>
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${t.borderLight}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 20, fontWeight: 400, color: t.text }}>
                  Mina sparade kurser
                </h2>
                <p style={{ fontSize: 12, color: t.textMuted, marginTop: 2 }}>
                  {savedCourses.length} kurs{savedCourses.length !== 1 ? 'er' : ''} sparade lokalt
                </p>
              </div>
              <button onClick={() => setShowLibrary(false)}
                style={{ background: 'none', border: 'none', fontSize: 18, color: t.textMuted, cursor: 'pointer' }}>✕</button>
            </div>
            <div style={{ maxHeight: 400, overflowY: 'auto' }}>
              {savedCourses.map((entry, i) => (
                <div key={entry.id || i} style={{ padding: '16px 24px', borderBottom: `1px solid ${t.borderLight}`,
                  display: 'flex', alignItems: 'center', gap: 16, transition: 'background .2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = t.bgSoft}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: t.text, marginBottom: 4 }}>
                      {entry.title}
                    </div>
                    <div style={{ fontSize: 12, color: t.textMuted, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                      <span>{entry.moduleCount} moduler</span>
                      <span>{entry.slideCount} slides</span>
                      {entry.hasVideo && <span style={{ color: '#7c3aed' }}>🎬 video</span>}
                      <span>{new Date(entry.savedAt).toLocaleDateString('sv-SE')} {new Date(entry.savedAt).toLocaleTimeString('sv-SE', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => loadSavedCourse(entry)}
                      style={{ padding: '8px 16px', fontSize: 12, fontWeight: 600, border: 'none',
                        borderRadius: 8, background: t.accent, color: '#fff', cursor: 'pointer' }}>
                      Öppna
                    </button>
                    <button onClick={() => {
                        if (confirm(`Radera "${entry.title}"?`)) deleteSavedCourse(entry.id);
                      }}
                      style={{ padding: '8px 12px', fontSize: 12, border: `1px solid ${t.border}`,
                        borderRadius: 8, background: 'transparent', color: t.textMuted, cursor: 'pointer' }}>
                      🗑
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{ padding: '14px 18px', marginBottom: 24, background: t.errorBg, border: `1px solid ${t.errorBorder}`,
            borderRadius: 12, color: t.errorText, fontSize: 13, display: 'flex', alignItems: 'center', gap: 12,
            animation: 'fadeUp .3s ease' }}>
            <span style={{ flex: 1 }}>{error}</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {prompt.trim() && (
                <button onClick={() => { setError(null); generateCourse(); }}
                  style={{ padding: '5px 12px', fontSize: 12, fontWeight: 600, background: 'transparent',
                    border: `1px solid ${t.errorBorder}`, borderRadius: 6, color: t.errorText, cursor: 'pointer' }}>
                  Försök igen
                </button>
              )}
              <button onClick={() => setError(null)} style={{ background: 'none', border: 'none', color: t.errorText, cursor: 'pointer', fontSize: 15 }}>✕</button>
            </div>
          </div>
        )}

        {/* ═══ STEP: DESCRIBE ═══ */}
        {step === 'describe' && (
          <div style={{ animation: 'fadeUp .5s ease' }}>
            {/* Hero */}
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 36, fontWeight: 400, lineHeight: 1.2, marginBottom: 10, letterSpacing: '-0.02em' }}>
                Skapa professionella<br/>e-utbildningar med AI
              </h2>
              <p style={{ fontSize: 15, color: t.textMuted, maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>
                Beskriv vad du behöver. AI:n bygger kursstruktur, scenarion och quiz — redo att exportera som SCORM.
              </p>
            </div>

            <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 16, padding: 0, overflow: 'hidden',
              boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.06)' }}>

              <div style={{ padding: '28px 28px 0' }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, display: 'block', marginBottom: 10, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Beskriv din utbildning
                </label>
                <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
                  placeholder="T.ex: En 20-minuters brandskyddsutbildning för kontorsanställda. Ska täcka utrymningsvägar, brandsläckare och larmrutiner. Quiz med 80% godkäntgräns."
                  style={{ width: '100%', minHeight: 130, background: t.bgInput, border: `1px solid ${t.borderInput}`,
                    borderRadius: 12, padding: '16px 18px', fontSize: 15, lineHeight: 1.65, color: t.text,
                    fontFamily: 'inherit', resize: 'vertical', transition: 'border-color .2s' }} />

                <div style={{ display: 'flex', gap: 6, marginTop: 12, flexWrap: 'wrap' }}>
                  {[
                    { label: 'Brandskydd', emoji: '🔥' },
                    { label: 'GDPR', emoji: '🔒' },
                    { label: 'Arbetsmiljö', emoji: '🏗️' },
                    { label: 'Onboarding', emoji: '👋' },
                    { label: 'IT-säkerhet', emoji: '💻' },
                  ].map(({ label, emoji }) => (
                    <button key={label} onClick={() => setPrompt(p => p ? p + '. Inkludera avsnitt om ' + label.toLowerCase() : label + '-utbildning, 20 minuter, quiz med 80% godkäntgräns')}
                      style={{ padding: '6px 12px', fontSize: 12, fontWeight: 500, background: t.accentSoft,
                        border: `1px solid ${t.accentBorder}`, borderRadius: 8, color: t.accentText, cursor: 'pointer',
                        transition: 'all .2s', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ fontSize: 13 }}>{emoji}</span> {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div style={{ margin: '24px 28px 0', borderTop: `1px solid ${t.borderLight}` }} />

              {/* Theme selector */}
              <div style={{ padding: '20px 28px' }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: t.textMuted, display: 'block', marginBottom: 10, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Färgtema för SCORM-paketet
                </label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {themes.map((th, i) => (
                    <button key={th.name} onClick={() => setSelectedTheme(i)}
                      style={{ padding: '10px 16px', fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 10,
                        background: selectedTheme === i ? t.accentSoft : t.bgInput,
                        border: `1.5px solid ${selectedTheme === i ? t.accent : t.borderLight}`,
                        borderRadius: 10, color: selectedTheme === i ? t.accentText : t.textSecondary, cursor: 'pointer', transition: 'all .2s' }}>
                      <div style={{ display: 'flex', gap: 3 }}>
                        <div style={{ width: 14, height: 14, borderRadius: 4, background: th.primary }} />
                        <div style={{ width: 14, height: 14, borderRadius: 4, background: th.accent }} />
                      </div>
                      {th.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate button area */}
              <div style={{ padding: '0 28px 28px' }}>
                {/* Image generation toggle */}
                {!isArtifact && (
                  <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button onClick={() => setGenerateImages(!generateImages)}
                      style={{ width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                        background: generateImages ? t.accent : t.bgInput,
                        position: 'relative', transition: 'background .2s', flexShrink: 0 }}>
                      <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff',
                        position: 'absolute', top: 3, left: generateImages ? 23 : 3,
                        transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                    </button>
                    <div>
                      <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>AI-genererade bilder</span>
                      <span style={{ fontSize: 12, color: t.textMuted, marginLeft: 8 }}>
                        {generateImages ? 'På — bilder skapas för intro-slides via Nano Banana' : 'Av — använder SVG-illustrationer'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Video avatar toggle */}
                {!isArtifact && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: useVideo ? 14 : 0 }}>
                      <button onClick={() => setUseVideo(!useVideo)}
                        style={{ width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
                          background: useVideo ? '#7c3aed' : t.bgInput,
                          position: 'relative', transition: 'background .2s', flexShrink: 0 }}>
                        <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff',
                          position: 'absolute', top: 3, left: useVideo ? 23 : 3,
                          transition: 'left .2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)' }} />
                      </button>
                      <div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: t.text }}>AI-videoavatar</span>
                        <span style={{ fontSize: 12, color: t.textMuted, marginLeft: 8 }}>
                          {useVideo ? 'På — HeyGen genererar video per modul' : 'Av — ingen videopresentatör'}
                        </span>
                      </div>
                    </div>

                    {/* Avatar & Voice picker */}
                    {useVideo && (
                      <div style={{ background: t.bgSoft, border: `1px solid ${t.border}`, borderRadius: 12, padding: 16 }}>
                        {heygenLoading && (
                          <p style={{ fontSize: 13, color: t.textMuted }}>Hämtar avatarer och röster från HeyGen...</p>
                        )}
                        {heygenError && (
                          <p style={{ fontSize: 13, color: t.errorText }}>{heygenError}</p>
                        )}

                        {!heygenLoading && !heygenError && (
                          <>
                            {/* Avatars */}
                            <label style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, letterSpacing: '0.04em',
                              textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Välj avatar</label>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16, maxHeight: 200, overflowY: 'auto' }}>
                              {heygenAvatars.slice(0, 12).map(a => (
                                <button key={a.avatar_id} onClick={() => setSelectedAvatar(a.avatar_id)}
                                  style={{ width: 80, padding: 6, border: `2px solid ${selectedAvatar === a.avatar_id ? '#7c3aed' : t.border}`,
                                    borderRadius: 10, background: selectedAvatar === a.avatar_id ? 'rgba(124,58,237,0.08)' : t.bgCard,
                                    cursor: 'pointer', transition: 'all .2s', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                                  {a.preview ? (
                                    <img src={a.preview} alt={a.name} style={{ width: 56, height: 56, borderRadius: 8, objectFit: 'cover' }} />
                                  ) : (
                                    <div style={{ width: 56, height: 56, borderRadius: 8, background: t.bgInput, display: 'flex',
                                      alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>👤</div>
                                  )}
                                  <span style={{ fontSize: 10, color: t.textSecondary, textAlign: 'center',
                                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', width: '100%' }}>
                                    {a.name}
                                  </span>
                                </button>
                              ))}
                            </div>

                            {/* Voices */}
                            <label style={{ fontSize: 11, fontWeight: 600, color: t.textMuted, letterSpacing: '0.04em',
                              textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Välj röst</label>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', maxHeight: 150, overflowY: 'auto' }}>
                              {heygenVoices.map(v => (
                                <button key={v.voice_id} onClick={() => setSelectedVoice(v.voice_id)}
                                  style={{ padding: '8px 12px', fontSize: 12, border: `1.5px solid ${selectedVoice === v.voice_id ? '#7c3aed' : t.border}`,
                                    borderRadius: 8, background: selectedVoice === v.voice_id ? 'rgba(124,58,237,0.08)' : t.bgCard,
                                    cursor: 'pointer', transition: 'all .2s', color: t.text }}>
                                  <span style={{ fontWeight: 500 }}>{v.name}</span>
                                  <span style={{ fontSize: 10, color: t.textMuted, marginLeft: 6 }}>{v.language}</span>
                                </button>
                              ))}
                            </div>

                            {heygenAvatars.length === 0 && (
                              <p style={{ fontSize: 12, color: t.textMuted, marginTop: 8 }}>
                                Inga avatarer hittades. Kontrollera att HEYGEN_API_KEY är konfigurerad i Vercel.
                              </p>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <button onClick={generateCourse} disabled={!prompt.trim() || (useVideo && (!selectedAvatar || !selectedVoice))} style={btnPrimary(!prompt.trim() || (useVideo && (!selectedAvatar || !selectedVoice)))}>
                  Generera utbildning {generateImages ? '(med bilder) ' : ''}{useVideo ? '(med video) ' : ''}→
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ═══ STEP: GENERATING ═══ */}
        {step === 'generating' && (
          <div style={{ animation: 'fadeUp .5s ease', textAlign: 'center', padding: '100px 20px' }}>
            <div style={{ width: 52, height: 52, border: `3px solid ${t.borderLight}`, borderTopColor: t.accent,
              borderRadius: '50%', animation: 'spin .9s linear infinite, glow 2s ease infinite', margin: '0 auto 28px' }} />
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontWeight: 400, marginBottom: 10 }}>Bygger din utbildning</h3>
            <p style={{ fontSize: 14, color: t.textMuted, animation: 'pulse 2s infinite' }}>{genProgress}</p>
          </div>
        )}

        {/* ═══ STEP: REVIEW ═══ */}
        {step === 'review' && course && !showPreview && (
          <div style={{ animation: 'fadeUp .5s ease' }}>
            <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 16, overflow: 'hidden',
              boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.06)' }}>

              {/* Course header */}
              <div style={{ padding: '28px 28px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 16, flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 26, fontWeight: 400, marginBottom: 6, letterSpacing: '-0.01em' }}>{course.title}</h2>
                  <p style={{ fontSize: 14, color: t.textMuted, lineHeight: 1.5 }}>{course.description}</p>
                </div>
                <button onClick={() => { setStep('describe'); setCourse(null); setVideoJobs([]); setVideoStep(''); setEditHistory([]); setShareUrl(''); setShareStatus(''); }} style={{ ...btnSecondary, padding: '8px 16px', fontSize: 12 }}>
                  ← Börja om
                </button>
              </div>

              {/* Stats row */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, margin: '24px 28px', background: t.borderLight, borderRadius: 12, overflow: 'hidden' }}>
                {[
                  { label: 'Moduler', value: course.modules.length, color: t.accent },
                  { label: 'Slides', value: totalSlides, color: isDark ? '#34d399' : '#059669' },
                  { label: 'Scenarion', value: totalScenarios, color: isDark ? '#fbbf24' : '#d97706' },
                  { label: 'Quiz-frågor', value: totalQuestions, color: isDark ? '#fb7185' : '#e11d48' },
                ].map(s => (
                  <div key={s.label} style={{ padding: '18px 16px', background: t.bgCard, textAlign: 'center' }}>
                    <div style={{ fontSize: 26, fontWeight: 700, color: s.color, fontFamily: "'DM Sans', sans-serif" }}>{s.value}</div>
                    <div style={{ fontSize: 11, color: t.textMuted, marginTop: 2, fontWeight: 500, letterSpacing: '0.03em', textTransform: 'uppercase' }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Modules */}
              <div style={{ padding: '0 28px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                {course.modules.map((mod, i) => (
                  <div key={i} onClick={() => setExpandedMod(expandedMod === i ? null : i)}
                    style={{ background: expandedMod === i ? t.bgCardHover : t.bgInput,
                      border: `1px solid ${expandedMod === i ? t.borderHover : t.borderLight}`,
                      borderRadius: 10, overflow: 'hidden', cursor: 'pointer', transition: 'all .3s' }}>
                    <div style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, display: 'flex',
                        alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff',
                        background: mod.type === 'quiz'
                          ? `linear-gradient(135deg, ${isDark ? '#fbbf24' : '#f59e0b'}, ${isDark ? '#f97316' : '#d97706'})`
                          : `linear-gradient(135deg, ${t.accent}, ${isDark ? '#6366f1' : '#1d4ed8'})` }}>
                        {mod.type === 'quiz' ? '?' : i + 1}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600 }}>{mod.title}</div>
                        <div style={{ fontSize: 12, color: t.textMuted }}>{(mod.slides||[]).length} slides · {mod.type}</div>
                      </div>
                      <span style={{ fontSize: 14, color: t.textDim, transition: 'transform .3s', transform: expandedMod === i ? 'rotate(180deg)' : '' }}>▾</span>
                    </div>
                    {expandedMod === i && (
                      <div style={{ padding: '0 18px 14px', borderTop: `1px solid ${t.borderLight}`, paddingTop: 12 }}>
                        {(mod.slides||[]).map((slide, si) => (
                          <div key={si} style={{ fontSize: 13, color: t.textSecondary, padding: '5px 0', display: 'flex', gap: 8, alignItems: 'center' }}>
                            <span style={{ fontSize: 10, width: 20, textAlign: 'center', color: t.textDim }}>
                              {slide.type === 'title' ? '◆' : slide.type === 'content' ? '▪' : slide.type === 'scenario' ? '◈' : slide.type === 'quiz' ? '?' : '▫'}
                            </span>
                            {slide.title || slide.type}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Video Generation Status */}
              {videoJobs.length > 0 && (
                <div style={{ margin: '24px 28px 0', borderTop: `1px solid ${t.borderLight}`, paddingTop: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#7c3aed', letterSpacing: '0.04em', textTransform: 'uppercase' }}>🎬 Videor</span>
                    <span style={{ fontSize: 12, color: t.textDim }}>—</span>
                    <span style={{ fontSize: 12, color: t.textMuted }}>
                      {videoStep === 'done'
                        ? `${videoJobs.filter(j => j.status === 'completed').length}/${videoJobs.length} klara`
                        : 'renderar...'}
                    </span>
                  </div>
                  {videoJobs.map((job, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8,
                      padding: '8px 12px', background: t.bgSoft, borderRadius: 8, border: `1px solid ${t.borderLight}` }}>
                      <span style={{ fontSize: 16 }}>
                        {job.status === 'completed' ? '✅' : job.status === 'failed' ? '❌' : '⏳'}
                      </span>
                      <span style={{ fontSize: 13, color: t.text, flex: 1 }}>{job.title}</span>
                      <span style={{ fontSize: 11, color: t.textMuted }}>
                        {job.status === 'completed' ? `${job.duration}s`
                          : job.status === 'failed' ? 'misslyckades'
                          : 'renderar...'}
                      </span>
                    </div>
                  ))}
                  {videoStep === 'done' && videoJobs.some(j => j.status === 'completed') && (
                    <button onClick={() => {
                      const completedJobs = videoJobs.filter(j => j.status === 'completed' && j.videoUrl);
                      console.log('[HeyGen] Attaching videos. Jobs:', completedJobs.map(j => `idx=${j.moduleIndex} "${j.title}" url=${j.videoUrl?.substring(0, 60)}...`));
                      setCourse(prev => {
                        if (!prev) return prev;
                        const updated = JSON.parse(JSON.stringify(prev));
                        console.log('[HeyGen] Modules before:', updated.modules.map((m, i) => `${i}:"${m.title}" video=${!!m.video_url}`));
                        for (const job of completedJobs) {
                          if (updated.modules[job.moduleIndex]) {
                            updated.modules[job.moduleIndex].video_url = job.videoUrl;
                            updated.modules[job.moduleIndex].video_duration = job.duration;
                            console.log(`[HeyGen] → Set module ${job.moduleIndex} "${updated.modules[job.moduleIndex].title}" video_url`);
                          } else {
                            console.log(`[HeyGen] ⚠ Module index ${job.moduleIndex} not found! Total modules: ${updated.modules.length}`);
                          }
                        }
                        console.log('[HeyGen] Modules after:', updated.modules.map((m, i) => `${i}:"${m.title}" video=${!!m.video_url}`));
                        return updated;
                      });
                      setAiEditSuccess('✅ Videor kopplade!');
                      setTimeout(() => setAiEditSuccess(''), 3000);
                    }}
                      style={{ marginTop: 12, padding: '10px 20px', fontSize: 13, fontWeight: 600, border: 'none',
                        borderRadius: 8, background: '#7c3aed', color: '#fff', cursor: 'pointer', width: '100%' }}>
                      🎬 Koppla videor till kursen ({videoJobs.filter(j => j.status === 'completed').length} st)
                    </button>
                  )}
                  {videoStep !== 'done' && (
                    <p style={{ fontSize: 11, color: t.textMuted, marginTop: 8 }}>
                      Videor renderas i bakgrunden. När alla är klara, klicka "Koppla videor" för att lägga till dem i kursen.
                    </p>
                  )}
                </div>
              )}

              {/* AI Edit */}
              <div style={{ margin: '24px 28px 0', borderTop: `1px solid ${t.borderLight}`, paddingTop: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: t.accentText, letterSpacing: '0.04em', textTransform: 'uppercase' }}>AI-redigering</span>
                  <span style={{ fontSize: 12, color: t.textDim }}>—</span>
                  <span style={{ fontSize: 12, color: t.textMuted }}>beskriv ändringen</span>
                </div>

                {editHistory.length > 0 && (
                  <div style={{ marginBottom: 12, maxHeight: 100, overflowY: 'auto' }}>
                    {editHistory.map((edit, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: 10, color: t.successText }}>✓</span>
                        <span style={{ fontSize: 12, color: t.textSecondary }}>{edit.instruction}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={editInput} onChange={e => setEditInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAiEditReview(); } }}
                    placeholder="T.ex: Lägg till ett avsnitt om stresshantering..."
                    disabled={isEditing}
                    style={{ flex: 1, padding: '11px 16px', fontSize: 13, border: `1px solid ${t.borderInput}`,
                      borderRadius: 10, background: t.bgInput, color: t.text, fontFamily: 'inherit',
                      opacity: isEditing ? 0.5 : 1, transition: 'all .2s' }} />
                  <button onClick={handleAiEditReview} disabled={!editInput.trim() || isEditing}
                    style={{ ...btnPrimary(!editInput.trim() || isEditing), padding: '11px 20px', fontSize: 13,
                      display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
                    {isEditing ? <><div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .8s linear infinite' }} /> Uppdaterar...</> : 'Ändra →'}
                  </button>
                </div>

                {!isEditing && editHistory.length === 0 && (
                  <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                    {['Gör tonen mer informell', 'Lägg till fler scenarion', 'Förenkla quiz-frågorna'].map(s => (
                      <button key={s} onClick={() => setEditInput(s)}
                        style={{ padding: '4px 10px', fontSize: 11, fontWeight: 500, background: t.accentSoft,
                          border: `1px solid ${t.accentBorder}`, borderRadius: 6, color: t.accentText, cursor: 'pointer' }}>
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 10, padding: '24px 28px', flexWrap: 'wrap' }}>
                <button onClick={handlePreview} style={{ ...btnSecondary, flex: '1 1 120px', textAlign: 'center' }}>
                  Förhandsgranska
                </button>
                <button onClick={async () => {
                  setShareStatus('sharing');
                  try {
                    const resp = await fetch('/api/share', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ course, videoJobs })
                    });
                    const data = await resp.json();
                    if (data.error) throw new Error(data.error);
                    setShareUrl(data.shareUrl);
                    setShareStatus('done');
                    navigator.clipboard?.writeText(data.shareUrl).catch(() => {});
                  } catch (err) {
                    setShareStatus('error');
                    setError('Kunde inte dela: ' + err.message);
                  }
                }} disabled={shareStatus === 'sharing'}
                  style={{ ...btnSecondary, flex: '1 1 120px', textAlign: 'center',
                    background: shareStatus === 'done' ? t.successBg : undefined,
                    borderColor: shareStatus === 'done' ? t.successBorder : undefined,
                    color: shareStatus === 'done' ? t.successText : undefined }}>
                  {shareStatus === 'sharing' ? '⏳ Delar...' : shareStatus === 'done' ? '✅ Länk kopierad!' : '🔗 Dela kurs'}
                </button>
                <button onClick={handleDownloadScorm} disabled={downloading}
                  style={{ ...btnPrimary(false), flex: '1 1 200px', textAlign: 'center',
                    background: downloading
                      ? `linear-gradient(90deg, ${t.accent}, #06b6d4, ${t.accent})`
                      : `linear-gradient(135deg, ${isDark ? '#34d399' : '#059669'}, ${isDark ? '#10b981' : '#047857'})`,
                    backgroundSize: downloading ? '200% 100%' : '100% 100%',
                    animation: downloading ? 'shimmer 1.5s linear infinite' : 'none',
                    boxShadow: `0 2px 12px ${isDark ? 'rgba(52,211,153,0.15)' : 'rgba(5,150,105,0.15)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                  {downloading ? 'Skapar paket...' : 'Ladda ner SCORM (.zip) →'}
                </button>
              </div>
              {shareUrl && (
                <div style={{ padding: '0 28px 20px' }}>
                  <div style={{ padding: '10px 14px', background: t.bgSoft, borderRadius: 8, border: `1px solid ${t.borderLight}`,
                    display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input readOnly value={shareUrl} style={{ flex: 1, background: 'none', border: 'none',
                      color: t.text, fontSize: 12, fontFamily: 'monospace', outline: 'none' }}
                      onClick={e => e.target.select()} />
                    <button onClick={() => { navigator.clipboard?.writeText(shareUrl); setShareStatus('done'); }}
                      style={{ padding: '4px 10px', fontSize: 11, border: `1px solid ${t.border}`,
                        borderRadius: 6, background: t.bgCard, color: t.text, cursor: 'pointer' }}>
                      Kopiera
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ═══ STEP: EXPORT ═══ */}
        {step === 'export' && !showPreview && (
          <div style={{ animation: 'fadeUp .5s ease', textAlign: 'center', padding: '80px 20px' }}>
            <div style={{ width: 72, height: 72, borderRadius: '50%', margin: '0 auto 24px',
              background: t.successBg, border: `2px solid ${t.successBorder}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={t.successText} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/>
              </svg>
            </div>
            <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, fontWeight: 400, marginBottom: 8 }}>SCORM-paket nedladdat</h3>
            <p style={{ fontSize: 14, color: t.textMuted, marginBottom: 28, maxWidth: 460, margin: '0 auto 28px', lineHeight: 1.6 }}>
              Ladda upp .zip-filen till ditt LMS – Learnster, Moodle, TalentLMS eller liknande.
            </p>
            <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => setStep('review')} style={btnSecondary}>← Kursöversikt</button>
              <button onClick={() => { setStep('describe'); setCourse(null); setPrompt(''); setVideoJobs([]); setVideoStep(''); setEditHistory([]); setShareUrl(''); setShareStatus(''); }} style={btnPrimary(false)}>Skapa ny utbildning →</button>
            </div>
          </div>
        )}

        {/* ═══ PREVIEW ═══ */}
        {showPreview && course && allSlides.length > 0 && (() => {
          const slide = allSlides[previewSlide] || allSlides[0];
          const progress = Math.round(((previewSlide + 1) / allSlides.length) * 100);

          const renderBlocks = (blocks) => (blocks||[]).map((b, bi) => {
            if (b.type === 'text') return <p key={bi} style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 14, color: t.textSecondary }}>{b.content}</p>;
            if (b.type === 'heading') return <h3 key={bi} style={{ fontSize: 18, fontWeight: 600, marginBottom: 12, marginTop: 22 }}>{b.content}</h3>;
            if (b.type === 'bullets') return <ul key={bi} style={{ paddingLeft: 22, marginBottom: 16 }}>{(b.items||[]).map((item, ii) => <li key={ii} style={{ fontSize: 15, lineHeight: 1.75, marginBottom: 6, color: t.textSecondary }}>{item}</li>)}</ul>;
            if (b.type === 'info') return <div key={bi} style={{ background: t.infoBg, borderLeft: `3px solid ${t.infoBorder}`, padding: '14px 18px', borderRadius: '0 10px 10px 0', margin: '16px 0', fontSize: 14, color: t.infoText, lineHeight: 1.6 }}>{b.content}</div>;
            if (b.type === 'warning') return <div key={bi} style={{ background: t.warnBg, borderLeft: '3px solid #f59e0b', padding: '14px 18px', borderRadius: '0 10px 10px 0', margin: '16px 0', fontSize: 14, color: t.warnText, lineHeight: 1.6 }}>{b.content}</div>;
            if (b.type === 'keypoint') return <div key={bi} style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderRadius: 10, padding: '16px 18px', margin: '16px 0' }}><div style={{ fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', color: t.accentText, marginBottom: 6, fontWeight: 600 }}>Viktigt</div><p style={{ fontSize: 14, color: t.textSecondary, lineHeight: 1.6 }}>{b.content}</p></div>;
            return null;
          });

          return (
            <div style={{ animation: 'fadeUp .4s ease' }}>
              {/* Preview header bar */}
              <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderBottom: 'none',
                borderRadius: '14px 14px 0 0', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444', opacity: 0.7 }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fbbf24', opacity: 0.7 }} />
                    <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#22c55e', opacity: 0.7 }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 500, color: t.textMuted, marginLeft: 8 }}>{course.title}</span>
                </div>
                <button onClick={() => setShowPreview(false)}
                  style={{ padding: '5px 12px', fontSize: 12, fontWeight: 600, background: t.bgInput,
                    border: `1px solid ${t.borderLight}`, borderRadius: 6, color: t.textSecondary, cursor: 'pointer' }}>
                  Stäng
                </button>
              </div>

              {/* Progress */}
              <div style={{ height: 2, background: t.borderLight }}>
                <div style={{ height: '100%', width: `${progress}%`, background: `linear-gradient(90deg, ${t.accent}, #06b6d4)`, transition: 'width .3s' }} />
              </div>

              {/* Slide body */}
              <div style={{ background: t.bgCard, border: `1px solid ${t.border}`, borderTop: 'none',
                borderRadius: '0 0 14px 14px', padding: '32px 28px', minHeight: 380,
                boxShadow: isDark ? '0 8px 32px rgba(0,0,0,0.3)' : '0 4px 24px rgba(0,0,0,0.06)' }}>

                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', color: t.accentText, marginBottom: 18 }}>
                  {slide.moduleName}
                </div>

                {/* Title slide */}
                {slide.type === 'title' && (
                  <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    {slide.moduleVideoUrl ? (
                      <div style={{ maxWidth: 560, margin: '0 auto 24px', borderRadius: 12, overflow: 'hidden',
                        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.08)' }}>
                        <video controls style={{ width: '100%', display: 'block' }}>
                          <source src={slide.moduleVideoUrl} type="video/mp4" />
                        </video>
                      </div>
                    ) : slide.generated_image ? (
                      <div style={{ maxWidth: 480, margin: '0 auto 24px', borderRadius: 12, overflow: 'hidden',
                        boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.08)' }}>
                        <img src={slide.generated_image} alt={slide.title}
                          style={{ width: '100%', height: 'auto', display: 'block' }} />
                      </div>
                    ) : (
                      <div style={{ maxWidth: 300, margin: '0 auto 24px' }}>
                        <SlideIllustration slide={slide} slideIndex={previewSlide} themeColor={course.theme?.primary || '#6366f1'} />
                      </div>
                    )}
                    <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 28, fontWeight: 400, marginBottom: 12 }}>{slide.title}</h2>
                    <p style={{ fontSize: 16, color: t.textMuted, maxWidth: 480, margin: '0 auto', lineHeight: 1.6 }}>{slide.subtitle}</p>
                  </div>
                )}

                {/* Content slide */}
                {slide.type === 'content' && (
                  <div>
                    <div style={{ marginBottom: 20 }}>
                      {slide.moduleVideoUrl ? (
                        <div style={{ maxWidth: 560, margin: '0 auto', borderRadius: 12, overflow: 'hidden',
                          boxShadow: isDark ? '0 4px 20px rgba(0,0,0,0.3)' : '0 4px 20px rgba(0,0,0,0.08)' }}>
                          <video controls style={{ width: '100%', display: 'block' }}>
                            <source src={slide.moduleVideoUrl} type="video/mp4" />
                          </video>
                        </div>
                      ) : (
                        <SlideIllustration slide={slide} slideIndex={previewSlide} themeColor={course.theme?.primary || '#6366f1'} />
                      )}
                    </div>
                    <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontWeight: 400, marginBottom: 16 }}>{slide.title}</h2>
                    {renderBlocks(slide.blocks)}
                  </div>
                )}

                {/* Scenario slide */}
                {slide.type === 'scenario' && (
                  <div>
                    <div style={{ marginBottom: 16 }}>
                      <SlideIllustration slide={slide} slideIndex={previewSlide} themeColor={course.theme?.primary || '#6366f1'} />
                    </div>
                    <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontWeight: 400, marginBottom: 8 }}>{slide.title || slide.scenario_title}</h2>
                    <p style={{ fontSize: 15, color: t.textSecondary, lineHeight: 1.75, marginBottom: 20 }}>{slide.scenario_description}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {(slide.options||[]).map((opt, oi) => {
                        const key = `${previewSlide}-${oi}`;
                        const answered = scenarioAnswers[previewSlide] !== undefined;
                        const selected = scenarioAnswers[previewSlide] === oi;
                        return (
                          <button key={oi} disabled={answered} onClick={() => setScenarioAnswers(prev => ({...prev, [previewSlide]: oi}))}
                            style={{ padding: '14px 18px', border: `1.5px solid ${answered ? (opt.correct ? t.successBorder : selected ? t.errorBorder : t.borderLight) : t.border}`,
                              borderRadius: 10, background: answered ? (opt.correct ? t.successBg : selected ? t.errorBg : t.bgInput) : t.bgInput,
                              fontSize: 14, color: t.text, cursor: answered ? 'default' : 'pointer', textAlign: 'left', transition: 'all .25s' }}>
                            {opt.text}
                            {answered && selected && <span style={{ float: 'right', fontSize: 12, fontWeight: 600, color: opt.correct ? t.successText : t.errorText }}>{opt.correct ? '✓' : '✗'}</span>}
                          </button>
                        );
                      })}
                    </div>
                    {scenarioAnswers[previewSlide] !== undefined && (
                      <div style={{ marginTop: 14, padding: '12px 16px', borderRadius: 10, fontSize: 13, lineHeight: 1.5,
                        background: (slide.options||[])[scenarioAnswers[previewSlide]]?.correct ? t.successBg : t.errorBg,
                        border: `1px solid ${(slide.options||[])[scenarioAnswers[previewSlide]]?.correct ? t.successBorder : t.errorBorder}`,
                        color: (slide.options||[])[scenarioAnswers[previewSlide]]?.correct ? t.successText : t.errorText,
                        animation: 'fadeUp .3s ease' }}>
                        {(slide.options||[])[scenarioAnswers[previewSlide]]?.feedback}
                      </div>
                    )}
                  </div>
                )}

                {/* Summary slide */}
                {slide.type === 'summary' && (
                  <div>
                    <div style={{ marginBottom: 20 }}>
                      <SlideIllustration slide={slide} slideIndex={previewSlide} themeColor={course.theme?.primary || '#6366f1'} />
                    </div>
                    <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontWeight: 400, marginBottom: 16 }}>{slide.title}</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {(slide.points||[]).map((p, pi) => (
                        <div key={pi} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '10px 14px',
                          background: t.bgInput, borderRadius: 8, fontSize: 14, color: t.textSecondary, lineHeight: 1.6 }}>
                          <span style={{ color: t.accent, fontWeight: 700, fontSize: 12, marginTop: 3, flexShrink: 0 }}>✓</span>
                          {p}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quiz slide */}
                {slide.type === 'quiz' && !quizResult && (
                  <div>
                    <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontWeight: 400, marginBottom: 6 }}>{slide.title}</h2>
                    {slide.description && <p style={{ fontSize: 14, color: t.textMuted, marginBottom: 20 }}>{slide.description}</p>}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                      {(slide.questions||[]).map((q, qi) => (
                        <div key={qi}>
                          <p style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>
                            <span style={{ color: t.accent }}>{qi+1}.</span> {q.question}
                          </p>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
                            {(q.options||[]).map((o, oi) => (
                              <button key={oi} onClick={() => setQuizSelections(prev => ({...prev, [qi]: oi}))}
                                style={{ padding: '11px 14px', border: `1.5px solid ${quizSelections[qi] === oi ? t.accent : t.borderLight}`,
                                  borderRadius: 8, background: quizSelections[qi] === oi ? t.accentSoft : t.bgInput,
                                  fontSize: 13, color: t.text, cursor: 'pointer', textAlign: 'left', transition: 'all .2s',
                                  fontWeight: quizSelections[qi] === oi ? 600 : 400 }}>
                                {o}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 24 }}>
                      <button onClick={handleQuizSubmit} style={btnPrimary(false)}>Rätta quiz</button>
                    </div>
                  </div>
                )}

                {/* Quiz result */}
                {slide.type === 'quiz' && quizResult && (
                  <div style={{ textAlign: 'center', padding: '30px 0' }}>
                    <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontWeight: 400, marginBottom: 10 }}>Ditt resultat</h2>
                    <div style={{ fontSize: 64, fontWeight: 800, color: quizResult.passed ? (isDark ? '#34d399' : '#059669') : (isDark ? '#fb7185' : '#e11d48'), margin: '16px 0', fontFamily: "'DM Sans', sans-serif" }}>
                      {quizResult.score}%
                    </div>
                    <div style={{ display: 'inline-block', padding: '8px 24px', borderRadius: 20, fontSize: 14, fontWeight: 600,
                      background: quizResult.passed ? t.successBg : t.errorBg,
                      color: quizResult.passed ? t.successText : t.errorText,
                      border: `1.5px solid ${quizResult.passed ? t.successBorder : t.errorBorder}` }}>
                      {quizResult.passed ? '✓ Godkänd' : '✗ Ej godkänd'}
                    </div>
                    <p style={{ fontSize: 14, color: t.textMuted, marginTop: 14 }}>
                      {quizResult.correct} av {quizResult.total} rätt.
                      {quizResult.passed ? ' Grattis!' : ` Du behöver minst ${passingScore}%.`}
                    </p>
                    {!quizResult.passed && (
                      <button onClick={() => { setQuizSelections({}); setQuizResult(null); }}
                        style={{ ...btnPrimary(false), marginTop: 16, padding: '10px 24px', fontSize: 13 }}>
                        Försök igen
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <button onClick={() => setPreviewSlide(Math.max(0, previewSlide - 1))} disabled={previewSlide === 0}
                  style={{ ...btnSecondary, padding: '10px 20px', fontSize: 13, opacity: previewSlide === 0 ? 0.3 : 1 }}>
                  ← Föregående
                </button>
                <span style={{ fontSize: 12, color: t.textMuted, fontWeight: 500 }}>{previewSlide + 1} / {allSlides.length}</span>
                <button onClick={() => setPreviewSlide(Math.min(allSlides.length - 1, previewSlide + 1))} disabled={previewSlide >= allSlides.length - 1}
                  style={{ ...btnPrimary(previewSlide >= allSlides.length - 1), padding: '10px 20px', fontSize: 13 }}>
                  Nästa →
                </button>
              </div>

              {/* AI Edit in preview */}
              {!showAiEdit ? (
                <div style={{ marginTop: 16, textAlign: 'center' }}>
                  <button onClick={() => setShowAiEdit(true)}
                    style={{ padding: '10px 20px', fontSize: 13, fontWeight: 600, background: t.accentSoft,
                      border: `1px solid ${t.accentBorder}`, borderRadius: 10, color: t.accentText, cursor: 'pointer' }}>
                    Ändra med AI
                  </button>
                </div>
              ) : (
                <div style={{ marginTop: 16, background: t.bgCard, border: `1px solid ${t.accentBorder}`,
                  borderRadius: 12, padding: 18, animation: 'fadeUp .3s ease' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: t.accentText, letterSpacing: '0.04em', textTransform: 'uppercase' }}>AI-redigering</span>
                    <button onClick={() => { setShowAiEdit(false); setAiEditPrompt(''); }}
                      style={{ background: 'none', border: 'none', color: t.textMuted, cursor: 'pointer', fontSize: 14 }}>✕</button>
                  </div>
                  {aiEditSuccess && (
                    <div style={{ padding: '8px 14px', marginBottom: 10, background: t.successBg,
                      border: `1px solid ${t.successBorder}`, borderRadius: 8, fontSize: 13, color: t.successText }}>
                      ✓ {aiEditSuccess}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8 }}>
                    <textarea value={aiEditPrompt} onChange={e => setAiEditPrompt(e.target.value)}
                      placeholder="Beskriv ändringen..."
                      onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAiEditPreview(); }}}
                      style={{ flex: 1, minHeight: 48, maxHeight: 100, background: t.bgInput, border: `1px solid ${t.borderInput}`,
                        borderRadius: 10, padding: '10px 14px', fontSize: 14, lineHeight: 1.5, color: t.text, fontFamily: 'inherit', resize: 'vertical' }} />
                    <button onClick={handleAiEditPreview} disabled={!aiEditPrompt.trim() || aiEditing}
                      style={{ ...btnPrimary(!aiEditPrompt.trim() || aiEditing), padding: '0 20px', fontSize: 13, height: 48, flexShrink: 0,
                        backgroundSize: aiEditing ? '200% 100%' : '100% 100%',
                        animation: aiEditing ? 'shimmer 1.5s linear infinite' : 'none',
                        display: 'flex', alignItems: 'center', gap: 6 }}>
                      {aiEditing && <div style={{ width: 14, height: 14, border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: '#fff', borderRadius: '50%', animation: 'spin .8s linear infinite' }} />}
                      {aiEditing ? 'Uppdaterar...' : 'Ändra →'}
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
                    {['Gör tonen mer informell', 'Lägg till fler scenarion', 'Förenkla quizfrågorna'].map(s => (
                      <button key={s} onClick={() => setAiEditPrompt(s)}
                        style={{ padding: '4px 10px', fontSize: 11, fontWeight: 500, background: t.bgInput,
                          border: `1px solid ${t.borderLight}`, borderRadius: 6, color: t.textMuted, cursor: 'pointer' }}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </div>
    </div>
  );
}
