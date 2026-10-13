(() => {
  let C = window.PORTFOLIO_CONTENT;
  try {
    const preview = localStorage.getItem('PORTFOLIO_PREVIEW');
    if (preview) C = JSON.parse(preview);
  } catch (e) {}

  const page = document.body.dataset.page;
  const main = document.getElementById('main');
  const esc = (value = '') => String(value)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');
  const two = n => String(n).padStart(2, '0');
  const firstName = (C.profile.name || 'Beryl').trim().split(/\s+/)[0];
  const L = C.labels || {};

  const accentLastWord = (value='') => {
    const words=String(value).trim().split(/\s+/);
    const last=words.pop()||'';
    return `${esc(words.join(' '))}${words.length?' ':''}<em>${esc(last)}</em>`;
  };

  const deco = (tone='burgundy') => `
    <div class="motif motif-${tone}" aria-hidden="true">
      <img class="motif-leaf" src="assets/botanical-line.svg" alt="">
      <img class="motif-orbit" src="assets/orbit-line.svg" alt="">
      <img class="motif-spark" src="assets/spark.svg" alt="">
    </div>`;

  const socialLinks = () => [
    ['LinkedIn', C.profile.linkedin],
    ['Instagram', C.profile.instagram],
    ['Behance', C.profile.behance]
  ].filter(([,v]) => v);

  const footer = () => `
    <section class="footer-cta" id="contact">
      ${deco('footer')}
      <div class="section-inner footer-cta-inner">
        <p class="meta-label reveal">${esc(C.identity.contactLabel)}</p>
        <h2 class="reveal">LET'S MAKE<br><em>SOMETHING.</em></h2>
        <div class="footer-actions reveal">
          <a class="editorial-btn filled" href="mailto:${esc(C.profile.email)}" data-cursor="OPEN">${esc(C.cta?.email || 'EMAIL ME')} <span>→</span></a>
          <a class="editorial-btn outline" href="contact.html" data-cursor="OPEN">${esc(C.cta?.contact || 'CONTACT')} <span>→</span></a>
        </div>
        <div class="footer-meta">
          <span>© ${new Date().getFullYear()} ${esc(C.profile.name)}</span>
          <span>${esc(C.profile.location)}</span>
          <span>${esc(C.profile.availability)}</span>
        </div>
      </div>
    </section>`;

  const imageOrVideo = (project, {autoplay=false, hero=false} = {}) => {
    if (project.video && autoplay) {
      return `<video ${hero ? 'class="hero-project-video"' : ''} autoplay muted loop playsinline preload="metadata" poster="${esc(project.poster || project.thumb)}"><source src="${esc(project.video)}" type="video/mp4"></video>`;
    }
    return `<img src="${esc(project.thumb)}" alt="${esc(project.title)} project preview" loading="lazy">`;
  };

  function workCard(p, i, variant='regular') {
    const classes = ['editorial-project', `project-${variant}`, `tone-${p.cardTone || 'plum'}`];
    const showVideo = p.video && (p.id === 'newmatic' || p.id === 'biofoods') && variant !== 'compact';
    const secondary = (p.gallery || []).find(src => src !== p.thumb && src !== p.hero) || (p.gallery || []).find(src => src !== p.thumb) || '';
    const secondaryMedia = secondary && (variant === 'feature' || variant === 'wide')
      ? `<img class="project-secondary" src="${esc(secondary)}" alt="${esc(p.title)} supporting project visual" loading="lazy">`
      : '';
    return `<a class="${classes.join(' ')} project-link reveal-scale" href="project.html?id=${encodeURIComponent(p.id)}" style="--project-accent:${esc(p.accent || '#601E2D')}" data-cursor="VIEW">
      <div class="project-visual">${imageOrVideo(p,{autoplay:showVideo})}${secondaryMedia}<span class="project-tint" aria-hidden="true"></span><span class="project-arrow" aria-hidden="true">↗</span></div>
      <div class="project-caption">
        <span class="project-index">${esc(p.number || two(i+1))}</span>
        <div class="project-caption-main"><h3>${esc(p.title)}</h3><p>${esc(p.short)}</p></div>
        <div class="project-caption-meta"><span>${esc(p.category)}</span><span>${esc(p.year)}</span></div>
      </div>
    </a>`;
  }

  function archiveCard(p, i, variant='standard') {
    const secondary = (p.gallery || []).find(src => src !== p.thumb) || '';
    const mediaMain = p.video && (variant === 'motion' || variant === 'lead')
      ? `<video autoplay muted loop playsinline preload="metadata" poster="${esc(p.poster || p.thumb)}"><source src="${esc(p.video)}" type="video/mp4"></video>`
      : `<img src="${esc(p.thumb)}" alt="${esc(p.title)} project preview" loading="lazy">`;
    const secondaryMedia = secondary && (variant === 'lead' || variant === 'wide') ? `<img class="archive-secondary archive-secondary-${variant}" src="${esc(secondary)}" alt="${esc(p.title)} detail" loading="lazy">` : '';
    return `<article class="archive-project archive-${variant} reveal-scale" data-type="${esc(p.type)}" data-project-id="${esc(p.id)}" style="--project-accent:${esc(p.accent || '#601E2D')}">
      <a class="archive-link project-link" href="project.html?id=${encodeURIComponent(p.id)}" data-cursor="VIEW">
        <div class="archive-media">${mediaMain}${secondaryMedia}<span class="archive-view">${esc(C.cta?.openCaseStudy || 'EXPLORE PROJECT')} ↗</span></div>
        <div class="archive-copy">
          <div class="archive-number">${esc(p.number || two(i+1))}</div>
          <div class="archive-title"><p>${esc(p.category).toUpperCase()}</p><h2>${esc(p.title)}</h2></div>
          <p class="archive-description">${esc(p.short)}</p>
          <div class="archive-tags">${(p.tags || []).slice(0,4).map(t=>`<span>${esc(t).toUpperCase()}</span>`).join('')}</div>
        </div>
      </a>
    </article>`;
  }

  function renderHome() {
    const featured = C.projects.filter(p => p.featured).slice(0,4);
    const heroProject = featured[0] || C.projects[0];
    const motionProject = C.projects.find(p=>p.id==='newmatic') || C.projects.find(p=>p.video);
    main.innerHTML = `
      <section class="home-hero">
        ${deco('hero')}
        <div class="hero-grid">
          <div class="hero-copy">
            <p class="meta-label hero-meta">${esc(C.profile.eyebrow)}</p>
            <h1 class="hero-statement editable-headline"><span class="clip-line"><span>${accentLastWord(C.profile.headline)}</span></span></h1>
            <p class="hero-roles">${esc(C.profile.rolesLine)}</p>
            <p class="hero-description">${esc(C.profile.intro)}</p>
            <div class="hero-actions"><a class="editorial-btn filled" href="work.html" data-cursor="VIEW">${esc(C.cta?.viewWork || 'VIEW MY WORK')} <span>→</span></a><a class="hero-text-link" href="about.html">${esc(C.cta?.meet || `MEET ${firstName.toUpperCase()}`)} ↗</a></div>
          </div>
          <a class="hero-collage project-link" href="project.html?id=${encodeURIComponent(heroProject.id)}" data-cursor="VIEW" style="--project-accent:${esc(heroProject.accent)}">
            <div class="hero-image hero-image-main">${imageOrVideo(heroProject)}</div>
            <div class="hero-image hero-image-secondary"><img src="${esc((featured[1]||heroProject).thumb)}" alt="Selected portfolio work"></div>
            <div class="hero-image hero-image-tertiary"><img src="${esc((featured[2]||heroProject).thumb)}" alt="Selected portfolio work"></div>
            <span class="hero-collage-label">${esc(L.heroSelectedWork || 'SELECTED WORK')}<br>${esc(heroProject.number || two(1))} / ${two(C.projects.length)}</span>
          </a>
        </div>
        <div class="hero-footer"><span>${esc(L.heroFooterStatement || C.identity.primaryStatement || 'DESIGN × MOTION × MARKETING')}</span><span>${esc(C.profile.location).toUpperCase()}</span><span>${two(1)} / ${two(C.projects.length)}</span></div>
      </section>

      <section class="motion-signature section-ivory" aria-label="Design Motion Marketing">
        <div class="section-inner motion-signature-inner">
          ${String(C.identity.primaryStatement || 'DESIGN × MOTION × MARKETING').split('×').map((x,i)=>`<span class="motion-node"><i>${two(i+1)}</i><strong>${esc(x.trim())}</strong></span>`).join('<span class="motion-connector" aria-hidden="true"><b></b></span>')}
        </div>
      </section>

      <section class="discipline-strip section-ivory">
        <div class="section-inner discipline-cards">
          ${C.disciplines.slice(0,3).map((d,i)=>`<a class="discipline-card reveal tone-${i===0?'burgundy':i===1?'orange':'green'}" href="services.html#discipline-${i+1}" aria-label="Explore ${esc(d.title)}"><span>${esc(d.number)}</span><h2>${esc(d.title).toUpperCase()}</h2><p>${esc(d.body)}</p><span class="discipline-arrow" aria-hidden="true">→</span></a>`).join('')}
        </div>
      </section>

      <section class="selected-editorial section-ivory">
        <div class="section-inner">
          <div class="section-heading-row reveal"><div><p class="meta-label">${esc(C.identity.selectedWorkLabel)}</p><h2>${accentLastWord(C.pages.homeSelectedWorkHeading || 'SELECTED WORK.')}</h2></div><p>${esc(C.pages.homeSelectedWorkLead || '')}</p></div>
          <div class="home-work-layout">
            <div class="home-work-main">
              ${featured[0] ? workCard(featured[0],0,'feature') : ''}
              ${featured[2] ? workCard(featured[2],2,'wide') : ''}
            </div>
            <aside class="home-work-rail">
              ${featured[1] ? workCard(featured[1],1,'portrait') : ''}
              <div class="home-work-bridge reveal" aria-hidden="true"><span>${esc(L.selectedWorkBridge || C.identity.primaryStatement || 'DESIGN × MOTION × MARKETING')}</span><i>${two(featured.length)} / ${two(C.projects.length)}</i></div>
              ${featured[3] ? workCard(featured[3],3,'compact') : ''}
            </aside>
          </div>
          <div class="section-end-link reveal"><a class="editorial-btn outline dark-outline" href="work.html">${esc(C.cta?.viewAllProjects || 'VIEW ALL PROJECTS')} <span>→</span></a></div>
        </div>
      </section>

      <section class="creative-value-section">
        ${deco('green')}
        <div class="section-inner creative-value-grid">
          <div><p class="meta-label reveal">${esc(L.whatIBringLabel || 'WHAT I BRING')}</p><h2 class="reveal">${esc(C.whatIBring.heading)}</h2></div>
          <div class="creative-value-copy reveal"><p>${esc(C.whatIBring.body)}</p><div class="flow-steps">${(L.flowSteps || ['Idea','Strategy','Design','Content','Execution']).map((x,i)=>`<div><span>${two(i+1)}</span><strong>${esc(x)}</strong></div>`).join('')}</div></div>
        </div>
      </section>

      ${motionProject ? `<section class="motion-feature section-ivory"><div class="section-inner"><div class="section-heading-row reveal"><div><p class="meta-label">${esc(C.pages.homeMotionEyebrow || 'MOTION / MOVING IMAGE')}</p><h2>${accentLastWord(C.pages.homeMotionHeading || 'MOTION IS PART OF THE IDEA.')}</h2></div><p>${esc(motionProject.short)}</p></div><a class="motion-screen reveal-scale" href="project.html?id=${encodeURIComponent(motionProject.id)}" data-cursor="PLAY"><video autoplay muted loop playsinline poster="${esc(motionProject.poster||motionProject.thumb)}"><source src="${esc(motionProject.video)}" type="video/mp4"></video><span class="motion-caption"><strong>${esc(motionProject.title)}</strong><span>${esc(L.motionCaseStudy || 'PLAY / CASE STUDY')} ↗</span></span></a></div></section>`:''}

      <section class="about-teaser-new">
        <div class="about-art-panel reveal-scale">${deco('about')}<div class="about-art-copy">${(L.aboutArtWords || ['CREATIVE','PROBLEM','SOLVER.']).map(x=>`<span>${esc(x)}</span>`).join('')}</div><small>${esc(L.aboutArtMark || C.identity.primaryStatement || 'DESIGN × MOTION × MARKETING')}</small></div>
        <div class="about-copy-panel"><p class="meta-label reveal">${esc(C.identity.aboutLabel)}</p><h2 class="reveal">${esc(C.about.declaration)}</h2><p class="reveal">${esc(C.about.body)}</p><a class="editorial-btn filled reveal" href="about.html">${esc(C.cta?.about || 'ABOUT BERYL')} <span>→</span></a></div>
      </section>
      ${footer()}`;
  }

  function renderWork() {
    const archiveVariants = C.projects.map((p,i) => {
      if (i === 0) return 'lead';
      if (p.id === 'stressed') return 'wide';
      if (p.type === 'motion' && i < 4) return 'motion';
      return ['portrait','wide','pair','poster','pair'][((i-1) % 5 + 5) % 5];
    });
    main.innerHTML = `
      <section class="page-hero editorial-page-hero work-page-hero">${deco('page')}<div class="section-inner"><p class="meta-label">${esc(C.pages.workEyebrow)}</p><div class="page-hero-grid"><h1>${accentLastWord(C.pages.workHeading)}</h1><p>${esc(C.pages.workLead)}</p></div></div></section>
      <section class="work-index work-index-dense section-ivory"><div class="section-inner">
        <div class="work-filter" role="group" aria-label="${esc(L.filterAria || 'Filter projects')}"><button class="filter-btn active" data-filter="all">${esc(L.filterAll || 'ALL')}</button><button class="filter-btn" data-filter="campaign">${esc(L.filterCampaign || 'DESIGN / CAMPAIGN')}</button><button class="filter-btn" data-filter="motion">${esc(L.filterMotion || 'MOTION / VIDEO')}</button><button class="filter-btn" data-filter="film">${esc(L.filterFilm || 'FILM')}</button></div>
        <div class="archive-kicker reveal"><span>${esc(L.archiveKicker || 'FEATURED + ARCHIVE')}</span><p>${esc(L.archiveLead || 'Graphic design, motion, marketing, social media and campaign execution.')}</p></div>
        <div class="work-archive-grid">${C.projects.map((p,i)=>archiveCard(p,i,archiveVariants[i])).join('')}</div>
      </div></section>
      <section class="animation-lab"><div class="section-inner"><div class="section-heading-row on-dark reveal"><div><p class="meta-label">${esc(C.pages.workAnimationEyebrow || 'ANIMATION / STUDIES')}</p><h2>${accentLastWord(C.pages.workAnimationHeading || 'LIGHT. SURFACE. MOTION.')}</h2></div><p>${esc(C.pages.workAnimationLead || '')}</p></div><div class="study-grid">${C.studies.map((s,i)=>`<article class="study-card reveal-scale"><div class="study-media"><video muted loop playsinline preload="metadata" poster="${esc(s.thumb)}"><source src="${esc(s.video)}" type="video/mp4"></video></div><div class="study-meta"><span>A${two(i+1)}</span><h3>${esc(s.title)}</h3><small>${esc(s.category)}</small></div></article>`).join('')}</div></div></section>
      ${footer()}`;
  }

  function renderAbout() {
    const portrait = C.profile.portrait
      ? `<img src="${esc(C.profile.portrait)}" alt="Portrait of ${esc(C.profile.name)}">`
      : `<div class="portrait-placeholder"><span>${esc(C.profile.initials || 'BW')}</span><img src="assets/botanical-line.svg" alt=""></div>`;
    main.innerHTML = `
      <section class="page-hero editorial-page-hero about-page-hero">${deco('page')}<div class="section-inner"><p class="meta-label">${esc(C.pages.aboutEyebrow)}</p><div class="page-hero-grid"><h1>${accentLastWord(C.about.heading)}</h1><p>${esc(C.about.intro)}</p></div></div></section>
      <section class="about-editorial section-ivory"><div class="section-inner about-editorial-grid"><div class="portrait-frame reveal-scale">${portrait}</div><div class="about-story"><p class="meta-label reveal">${esc(C.pages.aboutCreativeLabel || 'CREATIVE × COMMUNICATION')}</p><h2 class="reveal">${esc(C.about.declaration)}</h2><p class="lead-copy reveal">${esc(C.about.body)}</p><blockquote class="reveal">“${esc(C.whatIBring.heading)}”</blockquote><a class="editorial-btn outline dark-outline reveal" href="resume.html">${esc(C.cta?.viewResume || 'VIEW RÉSUMÉ')} <span>→</span></a></div></div></section>
      <section class="about-current"><div class="section-inner about-current-grid"><div><p class="meta-label reveal">${esc(L.currentlyLabel || 'CURRENTLY')}</p><div class="big-list">${C.about.current.map((x,i)=>`<div class="reveal"><span>${two(i+1)}</span><strong>${esc(x)}</strong></div>`).join('')}</div></div><div><p class="meta-label reveal">${esc(L.toolsLabel || 'TOOLS')}</p><div class="tool-cloud reveal">${C.about.tools.map(x=>`<span>${esc(x)}</span>`).join('')}</div><div class="about-location reveal"><span>${esc(C.profile.location)}</span><span>${esc(C.profile.availability)}</span></div></div></div></section>
      <section class="experience-editorial section-ivory"><div class="section-inner"><div class="section-heading-row reveal"><div><p class="meta-label">${esc(L.experienceLabel || 'EXPERIENCE')}</p><h2>${accentLastWord(C.pages.aboutExperienceHeading || 'DESIGN PRACTICE, MARKETING CONTEXT.')}</h2></div><p>${esc(C.pages.aboutExperienceLead || '')}</p></div><div class="experience-list">${C.experience.map((x,i)=>`<article class="experience-row reveal"><span class="experience-num">${two(i+1)}</span><div><h3>${esc(x.role)}</h3><strong>${esc(x.organisation)}</strong></div><div class="experience-period">${esc(x.period)}<br>${esc(x.location)}</div><p>${esc(x.bullets[0]||'')}</p></article>`).join('')}</div></div></section>
      ${footer()}`;
  }

  function renderServices() {
    const fallbackGroups = [
      [C.services[0],C.services[1],C.services[5],C.services[9]].filter(Boolean),
      [C.services[2],C.services[3],C.services[4]].filter(Boolean),
      [C.services[6],C.services[7],C.services[8],C.services[9]].filter(Boolean)
    ];
    const colors = ['burgundy','orange','green'];
    const groups = C.disciplines.slice(0,3).map((d,i)=>({n:d.number||two(i+1),title:(d.title||'Discipline').toUpperCase(),color:colors[i%colors.length],items:(d.services&&d.services.length?d.services:fallbackGroups[i]||[])}));
    main.innerHTML = `
      <section class="page-hero editorial-page-hero services-page-hero">${deco('page')}<div class="section-inner"><p class="meta-label">${esc(C.pages.servicesEyebrow)}</p><div class="page-hero-grid"><h1>${accentLastWord(C.pages.servicesHeading)}</h1><p>${esc(C.pages.servicesLead)}</p></div></div></section>
      <section class="service-groups section-ivory"><div class="section-inner"><div class="services-editorial-list">${groups.map((g,i)=>`<article id="discipline-${i+1}" class="service-group service-${g.color} reveal"><div class="service-number">${g.n}</div><div><h2>${g.title}</h2><div class="service-tags">${g.items.map(x=>`<span>${esc(x)}</span>`).join('')}</div></div><span class="service-mark">+</span></article>`).join('')}</div></div></section>
      <section class="process-section"><div class="section-inner"><p class="meta-label reveal">${esc(L.howIWorkLabel || 'HOW I WORK')}</p><h2 class="reveal">${accentLastWord(C.pages.servicesProcessHeading || 'FROM IDEA TO FINAL ASSET.')}</h2><div class="process-grid">${(L.processSteps || []).map((step,i)=>`<article class="reveal"><span>${two(i+1)}</span><strong>${esc(step.title)}</strong><p>${esc(step.body)}</p></article>`).join('')}</div></div></section>
      <section class="service-master-list section-ivory"><div class="section-inner"><p class="meta-label reveal">${esc(C.pages.servicesMasterLabel || 'SERVICES / 01-10')}</p><div class="service-master-grid">${C.services.map((s,i)=>`<div class="reveal"><span>${two(i+1)}</span><h3>${esc(s)}</h3></div>`).join('')}</div></div></section>
      ${footer()}`;
  }

  function renderContact() {
    main.innerHTML = `<section class="contact-editorial">${deco('contact')}<div class="section-inner contact-editorial-inner"><p class="meta-label">${esc(C.pages.contactEyebrow)}</p><h1>${accentLastWord(C.identity.footerStatement)}</h1><div class="contact-grid"><div><p>${esc(C.profile.intro)}</p><a class="contact-email" href="mailto:${esc(C.profile.email)}">${esc(C.profile.email)} ↗</a></div><div class="contact-meta"><span>${esc(L.contactPhone || 'PHONE')}</span><strong>${esc(C.profile.phoneDisplay)}</strong><span>${esc(L.contactLocation || 'LOCATION')}</span><strong>${esc(C.profile.location)}</strong><span>${esc(L.contactStatus || 'STATUS')}</span><strong>${esc(C.profile.availability)}</strong>${socialLinks().map(([n,u])=>`<a href="${esc(u)}" target="_blank" rel="noopener">${esc(n)} ↗</a>`).join('')}<a href="resume.html">${esc(L.contactResume || C.navigation.resume || 'RÉSUMÉ')} ↗</a></div></div></div></section>`;
  }

  function renderProject() {
    const params = new URLSearchParams(location.search);
    const id = params.get('id') || C.projects[0].id;
    const p = C.projects.find(x=>x.id===id) || C.projects[0];
    const index = C.projects.findIndex(x=>x.id===p.id);
    const next = C.projects[(index+1)%C.projects.length];
    document.title = `${p.title} | ${C.profile.name}`;
    const heroMedia = p.video ? `<video controls playsinline preload="metadata" poster="${esc(p.poster||p.hero||p.thumb)}"><source src="${esc(p.video)}" type="video/mp4"></video>` : `<img src="${esc(p.hero||p.thumb)}" alt="${esc(p.title)} hero visual">`;
    const gallery = (p.gallery||[]).map((src,i)=>`<figure class="case-visual ${i===0?'case-full':i%3===0?'case-wide':'case-half'} reveal-scale"><img src="${esc(src)}" alt="${esc(p.title)} project visual ${i+1}" loading="lazy"></figure>`).join('');
    main.innerHTML = `
      <section class="case-hero" style="--project-accent:${esc(p.accent||'#601E2D')}"><div class="case-hero-top"><div><p class="meta-label">${esc(p.number || two(index+1))} / ${two(C.projects.length)} · ${esc(p.category)}</p><h1>${esc(p.title)}</h1></div><div class="case-meta"><div><span>${esc(L.caseRole || 'ROLE')}</span><strong>${esc(p.role)}</strong></div><div><span>${esc(L.caseClient || 'CLIENT')}</span><strong>${esc(p.client)}</strong></div><div><span>${esc(L.caseYear || 'YEAR')}</span><strong>${esc(p.year)}</strong></div><div><span>${esc(L.caseTools || 'TOOLS')}</span><strong>${esc(p.tools.join(' / '))}</strong></div></div></div><div class="case-hero-media" style="view-transition-name:project-media">${heroMedia}</div></section>
      <section class="case-copy section-ivory"><div class="section-inner"><div class="case-mini-grid">
        <article class="case-detail reveal"><p class="meta-label">${esc(L.caseBrief || 'THE BRIEF')}</p><h2>${esc(C.pages.projectBriefHeading)}</h2><p>${esc(p.brief)}</p></article>
        <article class="case-detail reveal"><p class="meta-label">${esc(L.caseMyRole || 'MY ROLE')}</p><h2>${esc(p.role)}</h2><p>${esc(p.short)}</p></article>
        <article class="case-detail reveal"><p class="meta-label">${esc(L.caseApproach || 'THE APPROACH')}</p><h2>${esc(L.caseApproachHeading || 'How I shaped it.')}</h2><p>${esc(p.approach)}</p></article>
        <article class="case-detail case-deliverables reveal"><p class="meta-label">${esc(L.caseDeliverables || 'DELIVERABLES')}</p><div class="deliverable-list">${(p.deliverables || p.tags || []).map(x=>`<span>${esc(x)}</span>`).join('')}</div></article>
      </div></div></section>
      <section class="case-gallery"><div class="section-inner"><p class="meta-label reveal">${esc(L.caseWork || 'THE WORK')}</p><div class="case-gallery-grid">${gallery}</div>${p.video?`<div class="case-video reveal-scale"><video controls playsinline poster="${esc(p.poster||p.thumb)}"><source src="${esc(p.video)}" type="video/mp4"></video></div>`:''}</div></section>
      <section class="case-outcome section-ivory"><div class="section-inner case-outcome-grid"><div><p class="meta-label reveal">${esc(L.caseOutcome || 'OUTCOME')}</p><blockquote class="reveal">${esc(C.pages.projectOutcomeStatement)}</blockquote></div><p class="reveal">${esc(p.outcome)}</p></div></section>
      <section class="case-next" style="--project-accent:${esc(next.accent||'#601E2D')}"><a href="project.html?id=${encodeURIComponent(next.id)}" data-cursor="VIEW"><span>${esc(C.cta?.nextProject || 'NEXT PROJECT')}</span><strong>${esc(next.title)} →</strong></a></section>`;
  }

  function renderResume() {
    const capabilities = C.resume?.capabilities || ['Visual Design','Motion & Animation','Video Editing','Social Media','Campaign Design','Content Planning','Content Calendars'];
    main.innerHTML = `<section class="resume-editorial"><aside class="resume-sidebar"><div><p class="resume-name">${esc(C.profile.name).toUpperCase()}</p><div class="resume-stack">${esc(C.profile.eyebrow).replaceAll(' × ','<br>')}</div></div><div class="resume-side-group"><h3>${esc(L.resumeContact || 'CONTACT')}</h3><a href="mailto:${esc(C.profile.email)}">${esc(C.profile.email)}</a><a href="tel:${esc(C.profile.phoneLink)}">${esc(C.profile.phoneDisplay)}</a><span>${esc(C.profile.location)}</span></div><div class="resume-side-group"><h3>${esc(L.resumeCapabilities || 'SELECTED CAPABILITIES')}</h3>${capabilities.map(x=>`<span>${esc(x)}</span>`).join('')}</div><div class="resume-side-group"><h3>${esc(L.resumeSoftware || 'SOFTWARE')}</h3>${C.about.tools.map(x=>`<span>${esc(x)}</span>`).join('')}</div><div class="resume-side-mark">${esc(L.resumeSideMark || 'DESIGN × MOTION × MARKETING').replaceAll(' × ','<br>× ')}</div></aside><div class="resume-main"><div class="resume-topline"><span>${esc(L.resumeTitle || 'RÉSUMÉ')}</span><span>${esc(C.profile.name).toUpperCase()}</span></div><section><h1>${esc(L.resumeExperience || 'EXPERIENCE')}</h1>${C.experience.map((x,i)=>`<article class="resume-entry"><span class="resume-entry-num">${two(i+1)}</span><div><small>${esc(x.period)}</small><h2>${esc(x.organisation).toUpperCase()}</h2><h3>${esc(x.role)}</h3><ul>${x.bullets.map(b=>`<li>${esc(b)}</li>`).join('')}</ul></div></article>`).join('')}</section><section class="resume-lower"><div><h1>${esc(L.resumeEducation || 'EDUCATION')}</h1>${C.education.map(e=>`<article><h2>${esc(e.qualification)}</h2><p>${esc(e.institution)} · ${esc(e.period)}</p><p>${esc(e.detail)}</p></article>`).join('')}</div><div><h1>${esc(L.resumeProjects || 'SELECTED PROJECTS')}</h1>${C.projects.slice(0,4).map((p,i)=>`<p><strong>${esc(p.number || two(i+1))} ${esc(p.title)}</strong><br>${esc(p.category)} · ${esc(p.year)}</p>`).join('')}</div></section><div class="resume-actions"><button class="editorial-btn filled print-btn" onclick="window.print()">${esc(C.cta?.printResume || 'PRINT / SAVE PDF')} <span>→</span></button><a class="editorial-btn outline dark-outline" href="${esc(C.downloads?.resumeDocx || 'downloads/Beryl_Wabomba_Resume_2026.docx')}">${esc(L.resumeDownloadDocx || 'DOWNLOAD DOCX')} <span>→</span></a></div></div></section>`;
  }

  const renderers = {home:renderHome, work:renderWork, about:renderAbout, services:renderServices, contact:renderContact, project:renderProject, resume:renderResume};
  (renderers[page] || renderHome)();

  // Scroll to dynamically rendered service anchors when arriving from the homepage discipline cards.
  if (location.hash) {
    requestAnimationFrame(() => {
      const target = document.querySelector(location.hash);
      if (target) setTimeout(() => target.scrollIntoView({behavior:'smooth', block:'start'}), 60);
    });
  }

  // editable navigation labels and brand
  document.querySelectorAll('.nav-brand').forEach(el=>el.textContent=C.profile.name.toUpperCase());
  document.querySelectorAll('[data-nav="work"]').forEach(el=>el.textContent=C.navigation.work);
  document.querySelectorAll('[data-nav="about"]').forEach(el=>el.textContent=C.navigation.about);
  document.querySelectorAll('[data-nav="services"]').forEach(el=>el.textContent=C.navigation.services);
  document.querySelectorAll('[data-nav="contact"]').forEach(el=>el.textContent=C.navigation.contact);
  document.querySelectorAll('[data-nav="resume"]').forEach(el=>el.textContent=C.navigation.resume);
  document.querySelectorAll('.mobile-menu a[href="work.html"]').forEach(el=>el.textContent=C.navigation.work);
  document.querySelectorAll('.mobile-menu a[href="about.html"]').forEach(el=>el.textContent=C.navigation.about);
  document.querySelectorAll('.mobile-menu a[href="services.html"]').forEach(el=>el.textContent=C.navigation.services);
  document.querySelectorAll('.mobile-menu a[href="contact.html"]').forEach(el=>el.textContent=C.navigation.contact);
  document.querySelectorAll('.mobile-menu a[href="resume.html"]').forEach(el=>el.textContent=C.navigation.resume);
  document.querySelectorAll('[data-nav]').forEach(a=>a.classList.toggle('active', a.dataset.nav===page));
  document.querySelectorAll('.menu-meta').forEach(el=>el.textContent=C.identity.primaryStatement || C.profile.eyebrow);
  const metaDescription=document.querySelector('meta[name="description"]'); if(metaDescription) metaDescription.setAttribute('content', C.profile.intro || '');
  if(page!=='project') { const pageLabel={home:C.profile.eyebrow,work:C.navigation.work,about:C.navigation.about,services:C.navigation.services,contact:C.navigation.contact,resume:C.navigation.resume}[page] || C.profile.eyebrow; document.title=`${C.profile.name} | ${pageLabel}`; }

  const menuBtn=document.querySelector('.nav-menu-btn');
  const menu=document.getElementById('mobile-menu');
  if(menuBtn&&menu){menuBtn.addEventListener('click',()=>{const open=!menu.classList.contains('open');menu.classList.toggle('open',open);document.body.classList.toggle('menu-open',open);menuBtn.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-hidden',String(!open));menuBtn.textContent=open?(L.menuClose||'Close'):(L.menuOpen||'Menu');});}

  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target);}}),{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  document.querySelectorAll('.reveal,.reveal-scale').forEach(el=>observer.observe(el));

  document.querySelectorAll('.filter-btn').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter-btn').forEach(x=>x.classList.remove('active'));btn.classList.add('active');const f=btn.dataset.filter;document.querySelectorAll('[data-type].archive-project,.work-tile[data-type]').forEach(tile=>tile.classList.toggle('hidden',f!=='all'&&tile.dataset.type!==f));}));
  document.querySelectorAll('video[autoplay]').forEach(v=>{v.muted=true;v.play().catch(()=>{});});

  // Static portfolio artwork opens at full size without taking the user away from the page.
  // The surrounding project title/copy remains the route into the full case study.
  const setupGraphicLightbox = () => {
    const selector = [
      '.hero-collage .hero-image img',
      '.project-visual img',
      '.archive-media img',
      '.case-hero-media img',
      '.case-gallery img'
    ].join(',');
    const items = Array.from(document.querySelectorAll(selector));
    if (!items.length) return;

    const labelView = L.viewFullDesign || 'VIEW FULL DESIGN';
    const labelClose = L.lightboxClose || 'CLOSE';
    const labelPrevious = L.lightboxPrevious || 'PREVIOUS';
    const labelNext = L.lightboxNext || 'NEXT';
    const labelCase = C.cta?.openCaseStudy || 'EXPLORE PROJECT';

    const overlay = document.createElement('div');
    overlay.className = 'graphic-lightbox';
    overlay.setAttribute('aria-hidden','true');
    overlay.setAttribute('role','dialog');
    overlay.setAttribute('aria-modal','true');
    overlay.setAttribute('aria-label', labelView);
    overlay.innerHTML = `
      <div class="graphic-lightbox-toolbar">
        <span class="graphic-lightbox-count"></span>
        <button class="graphic-lightbox-close" type="button" aria-label="${esc(labelClose)}">${esc(labelClose)} ×</button>
      </div>
      <button class="graphic-lightbox-nav graphic-lightbox-prev" type="button" aria-label="${esc(labelPrevious)}">←</button>
      <figure class="graphic-lightbox-stage">
        <img class="graphic-lightbox-image" alt="">
        <figcaption class="graphic-lightbox-caption">
          <div><span class="graphic-lightbox-project"></span><strong class="graphic-lightbox-title"></strong></div>
          <a class="graphic-lightbox-case" href="#">${esc(labelCase)} ↗</a>
        </figcaption>
      </figure>
      <button class="graphic-lightbox-nav graphic-lightbox-next" type="button" aria-label="${esc(labelNext)}">→</button>`;
    document.body.appendChild(overlay);

    const view = overlay.querySelector('.graphic-lightbox-image');
    const count = overlay.querySelector('.graphic-lightbox-count');
    const projectLabel = overlay.querySelector('.graphic-lightbox-project');
    const title = overlay.querySelector('.graphic-lightbox-title');
    const caseLink = overlay.querySelector('.graphic-lightbox-case');
    const closeBtn = overlay.querySelector('.graphic-lightbox-close');
    const prevBtn = overlay.querySelector('.graphic-lightbox-prev');
    const nextBtn = overlay.querySelector('.graphic-lightbox-next');
    let activeIndex = 0;
    let lastTrigger = null;

    const findProject = img => {
      const src = img.getAttribute('src') || '';
      let project = C.projects.find(p => p.thumb === src || p.hero === src || (p.gallery || []).includes(src));
      if (project) return project;
      const link = img.closest('a[href*="project.html?id="]');
      if (link) {
        try {
          const id = new URL(link.getAttribute('href'), location.href).searchParams.get('id');
          project = C.projects.find(p => p.id === id);
        } catch (e) {}
      }
      if (!project && page === 'project') {
        const id = new URLSearchParams(location.search).get('id');
        project = C.projects.find(p => p.id === id);
      }
      return project || null;
    };

    const show = index => {
      activeIndex = (index + items.length) % items.length;
      const img = items[activeIndex];
      const project = findProject(img);
      const src = img.getAttribute('src');
      view.src = src;
      view.alt = img.alt || (project ? `${project.title} full design` : 'Full portfolio design');
      count.textContent = `${two(activeIndex + 1)} / ${two(items.length)}`;
      projectLabel.textContent = project ? String(project.category || '').toUpperCase() : C.identity.primaryStatement;
      title.textContent = project ? project.title : (img.alt || labelView);
      if (project) {
        caseLink.hidden = false;
        caseLink.href = `project.html?id=${encodeURIComponent(project.id)}`;
      } else {
        caseLink.hidden = true;
        caseLink.removeAttribute('href');
      }
      prevBtn.hidden = items.length < 2;
      nextBtn.hidden = items.length < 2;
    };

    const open = (img, index) => {
      lastTrigger = img;
      show(index);
      overlay.classList.add('open');
      overlay.setAttribute('aria-hidden','false');
      document.body.classList.add('lightbox-open');
      requestAnimationFrame(() => closeBtn.focus());
    };

    const close = () => {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden','true');
      document.body.classList.remove('lightbox-open');
      if (lastTrigger && typeof lastTrigger.focus === 'function' && !lastTrigger.closest('a')) lastTrigger.focus();
    };

    items.forEach((img,index) => {
      img.classList.add('graphic-preview-image');
      img.dataset.cursor = 'VIEW FULL';
      img.title = labelView;
      const frame = img.closest('.hero-image,.project-visual,.archive-media,.case-hero-media,.case-visual');
      if (frame) {
        frame.classList.add('has-full-view');
        frame.dataset.fullViewLabel = labelView;
      }
      img.addEventListener('click', e => {
        e.preventDefault();
        e.stopPropagation();
        open(img,index);
      });
      if (!img.closest('a')) {
        img.tabIndex = 0;
        img.setAttribute('role','button');
        img.setAttribute('aria-label', `${labelView}: ${img.alt || ''}`.trim());
        img.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            open(img,index);
          }
        });
      }
    });

    closeBtn.addEventListener('click', close);
    prevBtn.addEventListener('click', () => show(activeIndex - 1));
    nextBtn.addEventListener('click', () => show(activeIndex + 1));
    overlay.addEventListener('click', e => { if (e.target === overlay) close(); });
    addEventListener('keydown', e => {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(activeIndex - 1);
      if (e.key === 'ArrowRight') show(activeIndex + 1);
    });
  };
  setupGraphicLightbox();

  // lightweight parallax on decorative objects only
  const hero=document.querySelector('.home-hero');
  if(hero && matchMedia('(prefers-reduced-motion: no-preference)').matches){
    addEventListener('scroll',()=>{const y=Math.min(scrollY,innerHeight);hero.style.setProperty('--hero-shift',`${y*.035}px`);},{passive:true});
  }

  const dot=document.querySelector('.cursor-dot'), label=document.querySelector('.cursor-label');
  if(dot&&label&&matchMedia('(hover:hover) and (pointer:fine)').matches){
    let x=innerWidth/2,y=innerHeight/2,lx=x,ly=y;
    addEventListener('mousemove',e=>{x=e.clientX;y=e.clientY;dot.style.left=x+'px';dot.style.top=y+'px';});
    const loop=()=>{lx+=(x-lx)*.18;ly+=(y-ly)*.18;label.style.left=lx+'px';label.style.top=ly+'px';requestAnimationFrame(loop);};loop();
    document.querySelectorAll('[data-cursor],.project-link').forEach(el=>{el.addEventListener('mouseenter',()=>{label.textContent=el.dataset.cursor||'VIEW';label.classList.add('show');dot.classList.add('hide');});el.addEventListener('mouseleave',()=>{label.classList.remove('show');dot.classList.remove('hide');});});
  }

  document.querySelectorAll('a.project-link,.case-next a').forEach(link=>link.addEventListener('click',e=>{if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;const mediaEl=link.querySelector('.project-visual,.project-media');document.querySelectorAll('.project-visual,.project-media').forEach(m=>m.style.viewTransitionName='none');if(mediaEl)mediaEl.style.viewTransitionName='project-media';}));

  document.querySelectorAll('a[href]:not([href^="mailto:"]):not([href^="tel:"]):not([target="_blank"])').forEach(link=>{const url=link.getAttribute('href');if(!url||url.startsWith('#'))return;link.addEventListener('click',e=>{if(e.defaultPrevented||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;if('startViewTransition' in document||CSS.supports('view-transition-name','none'))return;e.preventDefault();document.querySelector('.page-transition')?.classList.add('in');setTimeout(()=>{location.href=url;},360);});});
})();
