(() => {
  const original = window.PORTFOLIO_CONTENT;
  let draft;
  try { draft = JSON.parse(localStorage.getItem('PORTFOLIO_PREVIEW')) || structuredClone(original); }
  catch { draft = structuredClone(original); }
  const main = document.getElementById('main');

  const esc = (v='') => String(v).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');
  const field = (label, path, value, type='text', full=false) => `<div class="field ${full?'full':''}"><label>${esc(label)}</label>${type==='textarea'?`<textarea data-path="${esc(path)}">${esc(value)}</textarea>`:`<input type="${type}" data-path="${esc(path)}" value="${esc(value)}">`}</div>`;
  const arrayField = (label,path,arr,full=true) => field(label,path,(arr||[]).join('\n'),'textarea',full);
  const card = (title, body, note='') => `<section class="editor-card"><h2>${esc(title)}</h2>${note?`<p class="editor-note">${esc(note)}</p>`:''}${body}</section>`;

  const setPath = (obj, path, value) => {
    const parts = path.split('.'); let cur=obj;
    parts.forEach((part,i)=>{ const key = /^\d+$/.test(part)?Number(part):part; if(i===parts.length-1) cur[key]=value; else cur=cur[key]; });
  };

  function renderProfile(){
    return card('Profile, contact and hero', `<div class="form-grid">
      ${field('Name','profile.name',draft.profile.name)}${field('Initials','profile.initials',draft.profile.initials)}
      ${field('Eyebrow','profile.eyebrow',draft.profile.eyebrow,'text',true)}
      ${field('Hero headline','profile.headline',draft.profile.headline,'text',true)}
      ${field('Roles line','profile.rolesLine',draft.profile.rolesLine,'text',true)}
      ${field('Short introduction','profile.intro',draft.profile.intro,'textarea',true)}
      ${field('Location','profile.location',draft.profile.location)}${field('Availability','profile.availability',draft.profile.availability)}
      ${field('Email','profile.email',draft.profile.email,'email')}${field('Phone display','profile.phoneDisplay',draft.profile.phoneDisplay)}
      ${field('Phone link','profile.phoneLink',draft.profile.phoneLink)}${field('Portrait path (optional)','profile.portrait',draft.profile.portrait)}
      ${field('LinkedIn URL','profile.linkedin',draft.profile.linkedin)}${field('Instagram URL','profile.instagram',draft.profile.instagram)}
      ${field('Behance URL','profile.behance',draft.profile.behance)}${field('Résumé DOCX path','downloads.resumeDocx',draft.downloads?.resumeDocx || '')}${field('Résumé PDF path','downloads.resumePdf',draft.downloads?.resumePdf || '')}
    </div>`,'Everything here updates the hero, contact page and live résumé.');
  }

  function renderAbout(){
    return card('About and positioning', `<div class="form-grid">
      ${field('About heading','about.heading',draft.about.heading,'text',true)}
      ${field('About intro','about.intro',draft.about.intro,'textarea',true)}
      ${field('About body','about.body',draft.about.body,'textarea',true)}
      ${field('Declaration','about.declaration',draft.about.declaration,'textarea',true)}
      ${field('What I bring heading','whatIBring.heading',draft.whatIBring.heading,'textarea',true)}
      ${field('What I bring body','whatIBring.body',draft.whatIBring.body,'textarea',true)}
      ${arrayField('Current disciplines, one per line','about.current',draft.about.current)}
      ${arrayField('Tools, one per line','about.tools',draft.about.tools)}${arrayField('Résumé selected capabilities, one per line','resume.capabilities',draft.resume?.capabilities || [])}
    </div>`);
  }

  function renderDisciplines(){
    const disc = draft.disciplines.map((d,i)=>`<div class="repeat-item"><div class="repeat-item-head"><strong>${esc(d.number)} · ${esc(d.title)}</strong><div><button class="small-btn" data-move="disciplines" data-index="${i}" data-dir="-1">↑</button> <button class="small-btn" data-move="disciplines" data-index="${i}" data-dir="1">↓</button> <button class="small-btn danger" data-remove="disciplines" data-index="${i}">Remove</button></div></div><div class="form-grid">${field('Number',`disciplines.${i}.number`,d.number)}${field('Title',`disciplines.${i}.title`,d.title)}${field('Description',`disciplines.${i}.body`,d.body,'textarea',true)}${arrayField('Services shown in this discipline, one per line',`disciplines.${i}.services`,d.services || [])}</div></div>`).join('');
    const serv = draft.services.map((s,i)=>`<div class="repeat-item"><div class="repeat-item-head"><strong>${String(i+1).padStart(2,'0')}</strong><button class="small-btn danger" data-remove="services" data-index="${i}">Remove</button></div>${field('Service',`services.${i}`,s,'text',true)}</div>`).join('');
    return card('Core disciplines', `<div class="repeat-list">${disc}</div><button class="add-btn" data-add="disciplines">+ Add discipline</button>`) + card('Services', `<div class="repeat-list">${serv}</div><button class="add-btn" data-add="services">+ Add service</button>`);
  }

  function renderLabels(){
    const p = draft.labels || (draft.labels = {});
    const process = (p.processSteps || []).map((s,i)=>`<div class="repeat-item"><div class="repeat-item-head"><strong>Process ${String(i+1).padStart(2,'0')}</strong></div><div class="form-grid">${field('Title',`labels.processSteps.${i}.title`,s.title)}${field('Description',`labels.processSteps.${i}.body`,s.body,'textarea',true)}</div></div>`).join('');
    return card('Editable site labels', `<div class="form-grid">
      ${field('Hero selected work label','labels.heroSelectedWork',p.heroSelectedWork || '')}${field('Mobile menu open label','labels.menuOpen',p.menuOpen || '')}${field('Mobile menu close label','labels.menuClose',p.menuClose || '')}
      ${field('Hero footer statement','labels.heroFooterStatement',p.heroFooterStatement || '')}
      ${field('Selected work bridge statement','labels.selectedWorkBridge',p.selectedWorkBridge || '')}
      ${field('What I bring label','labels.whatIBringLabel',p.whatIBringLabel || '')}
      ${arrayField('Flow steps, one per line','labels.flowSteps',p.flowSteps || [])}
      ${field('Motion case-study label','labels.motionCaseStudy',p.motionCaseStudy || '')}
      ${arrayField('About artwork words, one per line','labels.aboutArtWords',p.aboutArtWords || [])}
      ${field('About artwork mark','labels.aboutArtMark',p.aboutArtMark || '')}
      ${field('Work archive kicker','labels.archiveKicker',p.archiveKicker || '')}
      ${field('Work archive supporting line','labels.archiveLead',p.archiveLead || '','textarea',true)}
      ${field('Filter: All','labels.filterAll',p.filterAll || '')}${field('Filter: Campaign','labels.filterCampaign',p.filterCampaign || '')}
      ${field('Filter: Motion','labels.filterMotion',p.filterMotion || '')}${field('Filter: Film','labels.filterFilm',p.filterFilm || '')}
      ${field('About currently label','labels.currentlyLabel',p.currentlyLabel || '')}${field('About tools label','labels.toolsLabel',p.toolsLabel || '')}
      ${field('Experience label','labels.experienceLabel',p.experienceLabel || '')}${field('How I work label','labels.howIWorkLabel',p.howIWorkLabel || '')}
      ${field('Contact phone label','labels.contactPhone',p.contactPhone || '')}${field('Contact location label','labels.contactLocation',p.contactLocation || '')}
      ${field('Contact status label','labels.contactStatus',p.contactStatus || '')}${field('Contact resume label','labels.contactResume',p.contactResume || '')}
      ${field('Case study: Role','labels.caseRole',p.caseRole || '')}${field('Case study: Client','labels.caseClient',p.caseClient || '')}
      ${field('Case study: Year','labels.caseYear',p.caseYear || '')}${field('Case study: Tools','labels.caseTools',p.caseTools || '')}
      ${field('Case study: Brief','labels.caseBrief',p.caseBrief || '')}${field('Case study: My Role','labels.caseMyRole',p.caseMyRole || '')}
      ${field('Case study: Approach','labels.caseApproach',p.caseApproach || '')}${field('Case study approach heading','labels.caseApproachHeading',p.caseApproachHeading || '')}
      ${field('Case study: Deliverables','labels.caseDeliverables',p.caseDeliverables || '')}${field('Case study: The Work','labels.caseWork',p.caseWork || '')}
      ${field('Case study: Outcome','labels.caseOutcome',p.caseOutcome || '')}
      ${field('Résumé: Contact','labels.resumeContact',p.resumeContact || '')}${field('Résumé: Capabilities','labels.resumeCapabilities',p.resumeCapabilities || '')}
      ${field('Résumé: Software','labels.resumeSoftware',p.resumeSoftware || '')}${field('Résumé side mark','labels.resumeSideMark',p.resumeSideMark || '')}
      ${field('Résumé title','labels.resumeTitle',p.resumeTitle || '')}${field('Résumé: Experience','labels.resumeExperience',p.resumeExperience || '')}
      ${field('Résumé: Education','labels.resumeEducation',p.resumeEducation || '')}${field('Résumé: Selected Projects','labels.resumeProjects',p.resumeProjects || '')}
      ${field('Résumé DOCX button','labels.resumeDownloadDocx',p.resumeDownloadDocx || '')}
      ${field('Static artwork hover label','labels.viewFullDesign',p.viewFullDesign || '')}${field('Lightbox close label','labels.lightboxClose',p.lightboxClose || '')}
      ${field('Lightbox previous label','labels.lightboxPrevious',p.lightboxPrevious || '')}${field('Lightbox next label','labels.lightboxNext',p.lightboxNext || '')}
    </div>`) + card('Editable process steps', `<div class="repeat-list">${process}</div>`, 'These labels and step descriptions are used throughout the public site, so you no longer need to edit app.js for visible interface copy.');
  }

  function renderExperience(){
    const exp = draft.experience.map((x,i)=>`<div class="repeat-item"><div class="repeat-item-head"><strong>${esc(x.role)} · ${esc(x.organisation)}</strong><div><button class="small-btn" data-move="experience" data-index="${i}" data-dir="-1">↑</button> <button class="small-btn" data-move="experience" data-index="${i}" data-dir="1">↓</button> <button class="small-btn danger" data-remove="experience" data-index="${i}">Remove</button></div></div><div class="form-grid">${field('Role',`experience.${i}.role`,x.role)}${field('Organisation',`experience.${i}.organisation`,x.organisation)}${field('Period',`experience.${i}.period`,x.period)}${field('Location',`experience.${i}.location`,x.location)}${arrayField('Bullet points, one per line',`experience.${i}.bullets`,x.bullets)}</div></div>`).join('');
    const edu = draft.education.map((x,i)=>`<div class="repeat-item"><div class="repeat-item-head"><strong>${esc(x.qualification)}</strong><button class="small-btn danger" data-remove="education" data-index="${i}">Remove</button></div><div class="form-grid">${field('Qualification',`education.${i}.qualification`,x.qualification)}${field('Institution',`education.${i}.institution`,x.institution)}${field('Period',`education.${i}.period`,x.period)}${field('Detail',`education.${i}.detail`,x.detail,'textarea',true)}</div></div>`).join('');
    return card('Experience', `<div class="repeat-list">${exp}</div><button class="add-btn" data-add="experience">+ Add experience</button>`) + card('Education', `<div class="repeat-list">${edu}</div><button class="add-btn" data-add="education">+ Add education</button>`);
  }

  function renderProjects(){
    const items = draft.projects.map((p,i)=>`<div class="repeat-item"><div class="repeat-item-head"><strong>${String(i+1).padStart(2,'0')} · ${esc(p.title)}</strong><div><button class="small-btn" data-move="projects" data-index="${i}" data-dir="-1">↑</button> <button class="small-btn" data-move="projects" data-index="${i}" data-dir="1">↓</button> <button class="small-btn danger" data-remove="projects" data-index="${i}">Remove</button></div></div><div class="form-grid">
      ${field('ID / slug',`projects.${i}.id`,p.id)}${field('Project number',`projects.${i}.number`,p.number || String(i+1).padStart(2,'0'))}${field('Title',`projects.${i}.title`,p.title)}
      ${field('Client',`projects.${i}.client`,p.client)}${field('Year',`projects.${i}.year`,p.year)}
      ${field('Category',`projects.${i}.category`,p.category)}${field('Role',`projects.${i}.role`,p.role)}
      ${field('Type: campaign / motion / film',`projects.${i}.type`,p.type)}${field('Layout: feature / wide / medium / small',`projects.${i}.layout`,p.layout)}
      ${field('Accent colour',`projects.${i}.accent`,p.accent,'color')}${field('Card tone',`projects.${i}.cardTone`,p.cardTone)}
      ${field('Short description',`projects.${i}.short`,p.short,'textarea',true)}
      ${field('Brief',`projects.${i}.brief`,p.brief,'textarea',true)}
      ${field('Approach',`projects.${i}.approach`,p.approach,'textarea',true)}
      ${field('Outcome',`projects.${i}.outcome`,p.outcome,'textarea',true)}
      ${arrayField('Tags, one per line',`projects.${i}.tags`,p.tags)}${arrayField('Deliverables, one per line',`projects.${i}.deliverables`,p.deliverables || [])}
      ${arrayField('Tools, one per line',`projects.${i}.tools`,p.tools)}
      ${field('Thumbnail path',`projects.${i}.thumb`,p.thumb)}${field('Hero path',`projects.${i}.hero`,p.hero)}
      ${field('Video path',`projects.${i}.video`,p.video)}${field('Video poster path',`projects.${i}.poster`,p.poster)}
      ${arrayField('Gallery image paths, one per line',`projects.${i}.gallery`,p.gallery)}
      <div class="field full"><label><input style="width:auto" type="checkbox" data-check-path="projects.${i}.featured" ${p.featured?'checked':''}> Featured on homepage</label></div>
    </div></div>`).join('');
    return card('Projects and case studies', `<div class="repeat-list">${items}</div><button class="add-btn" data-add="projects">+ Add project</button>`, 'For new images or videos: copy the file into the assets folder, then enter a path such as assets/my-new-project.webp.');
  }

  function renderStudies(){
    const items = draft.studies.map((s,i)=>`<div class="repeat-item"><div class="repeat-item-head"><strong>${esc(s.title)}</strong><button class="small-btn danger" data-remove="studies" data-index="${i}">Remove</button></div><div class="form-grid">${field('ID',`studies.${i}.id`,s.id)}${field('Title',`studies.${i}.title`,s.title)}${field('Category',`studies.${i}.category`,s.category,'text',true)}${field('Thumbnail path',`studies.${i}.thumb`,s.thumb)}${field('Video path',`studies.${i}.video`,s.video)}</div></div>`).join('');
    return card('Animation studies', `<div class="repeat-list">${items}</div><button class="add-btn" data-add="studies">+ Add study</button>`);
  }


  function renderSiteCopy(){
    return card('Navigation labels', `<div class="form-grid">
      ${field('Work','navigation.work',draft.navigation.work)}${field('About','navigation.about',draft.navigation.about)}
      ${field('Services','navigation.services',draft.navigation.services)}${field('Contact','navigation.contact',draft.navigation.contact)}
      ${field('Résumé','navigation.resume',draft.navigation.resume)}
    </div>`) + card('Global site copy', `<div class="form-grid">
      ${field('Concept','identity.concept',draft.identity.concept)}${field('Signature statement','identity.primaryStatement',draft.identity.primaryStatement)}
      ${field('Footer CTA','identity.footerStatement',draft.identity.footerStatement)}${field('Scroll label','identity.scrollLabel',draft.identity.scrollLabel)}
      ${field('Selected work label','identity.selectedWorkLabel',draft.identity.selectedWorkLabel)}${field('About label','identity.aboutLabel',draft.identity.aboutLabel)}
      ${field('Disciplines label','identity.disciplinesLabel',draft.identity.disciplinesLabel)}${field('Services label','identity.servicesLabel',draft.identity.servicesLabel)}
      ${field('Contact label','identity.contactLabel',draft.identity.contactLabel)}
    </div>`) + card('Page headings and introductions', `<div class="form-grid">
      ${field('Work eyebrow','pages.workEyebrow',draft.pages.workEyebrow)}${field('Work heading','pages.workHeading',draft.pages.workHeading)}
      ${field('Work lead','pages.workLead',draft.pages.workLead,'textarea',true)}
      ${field('About eyebrow','pages.aboutEyebrow',draft.pages.aboutEyebrow,'text',true)}
      ${field('Services eyebrow','pages.servicesEyebrow',draft.pages.servicesEyebrow)}${field('Services heading','pages.servicesHeading',draft.pages.servicesHeading)}
      ${field('Services lead','pages.servicesLead',draft.pages.servicesLead,'textarea',true)}
      ${field('Services section heading','pages.servicesSectionHeading',draft.pages.servicesSectionHeading,'text',true)}
      ${field('Contact eyebrow','pages.contactEyebrow',draft.pages.contactEyebrow)}
      ${field('Project brief heading','pages.projectBriefHeading',draft.pages.projectBriefHeading,'text',true)}
      ${field('Project outcome statement','pages.projectOutcomeStatement',draft.pages.projectOutcomeStatement,'textarea',true)}
      ${field('Home selected work heading','pages.homeSelectedWorkHeading',draft.pages.homeSelectedWorkHeading || '')}
      ${field('Home selected work lead','pages.homeSelectedWorkLead',draft.pages.homeSelectedWorkLead || '','textarea',true)}
      ${field('Home motion eyebrow','pages.homeMotionEyebrow',draft.pages.homeMotionEyebrow || '')}
      ${field('Home motion heading','pages.homeMotionHeading',draft.pages.homeMotionHeading || '')}
      ${field('About creative label','pages.aboutCreativeLabel',draft.pages.aboutCreativeLabel || '')}
      ${field('About experience heading','pages.aboutExperienceHeading',draft.pages.aboutExperienceHeading || '')}
      ${field('About experience lead','pages.aboutExperienceLead',draft.pages.aboutExperienceLead || '','textarea',true)}
      ${field('Animation eyebrow','pages.workAnimationEyebrow',draft.pages.workAnimationEyebrow || '')}
      ${field('Animation heading','pages.workAnimationHeading',draft.pages.workAnimationHeading || '')}
      ${field('Animation lead','pages.workAnimationLead',draft.pages.workAnimationLead || '','textarea',true)}
      ${field('Services process heading','pages.servicesProcessHeading',draft.pages.servicesProcessHeading || '')}
      ${field('Services master label','pages.servicesMasterLabel',draft.pages.servicesMasterLabel || '')}
    </div>`) + card('Buttons and calls to action', `<div class="form-grid">
      ${field('View work','cta.viewWork',draft.cta?.viewWork || '')}${field('Meet / about text link','cta.meet',draft.cta?.meet || '')}
      ${field('View all projects','cta.viewAllProjects',draft.cta?.viewAllProjects || '')}${field('About button','cta.about',draft.cta?.about || '')}
      ${field('Email button','cta.email',draft.cta?.email || '')}${field('Contact button','cta.contact',draft.cta?.contact || '')}
      ${field('View résumé','cta.viewResume',draft.cta?.viewResume || '')}${field('Print résumé','cta.printResume',draft.cta?.printResume || '')}
      ${field('Explore project','cta.openCaseStudy',draft.cta?.openCaseStudy || '')}${field('Next project','cta.nextProject',draft.cta?.nextProject || '')}
    </div>`);
  }

  const tabs = [
    ['profile','Profile'],['sitecopy','Site Copy'],['labels','Labels'],['about','About'],['disciplines','Disciplines & Services'],['experience','Experience'],['projects','Projects'],['studies','Animation']
  ];

  function render(active='profile'){
    main.innerHTML = `<div class="editor-page"><div class="editor-shell"><div class="editor-top"><div><h1>Portfolio Content Manager</h1><p class="editor-note">Edit the content, preview it locally, then download a new content.js and replace the old file in the website folder before publishing.</p></div><div class="editor-actions"><button data-action="preview" class="primary">Save preview</button><button data-action="download">Download content.js</button><button data-action="json">Download JSON backup</button><button data-action="reset">Reset preview</button><a class="small-btn" href="index.html" target="_blank">Open website ↗</a></div></div><div class="editor-tabs">${tabs.map(([id,label])=>`<button class="${id===active?'active':''}" data-tab="${id}">${label}</button>`).join('')}</div><section class="editor-panel ${active==='profile'?'active':''}" data-panel="profile">${renderProfile()}</section><section class="editor-panel ${active==='sitecopy'?'active':''}" data-panel="sitecopy">${renderSiteCopy()}</section><section class="editor-panel ${active==='labels'?'active':''}" data-panel="labels">${renderLabels()}</section><section class="editor-panel ${active==='about'?'active':''}" data-panel="about">${renderAbout()}</section><section class="editor-panel ${active==='disciplines'?'active':''}" data-panel="disciplines">${renderDisciplines()}</section><section class="editor-panel ${active==='experience'?'active':''}" data-panel="experience">${renderExperience()}</section><section class="editor-panel ${active==='projects'?'active':''}" data-panel="projects">${renderProjects()}</section><section class="editor-panel ${active==='studies'?'active':''}" data-panel="studies">${renderStudies()}</section></div></div>`;
  }

  function currentTab(){ return document.querySelector('.editor-tabs button.active')?.dataset.tab || 'profile'; }

  function commitField(el){
    const path = el.dataset.path;
    if (!path) return;
    let value = el.value;
    if (path.endsWith('.tags') || path.endsWith('.tools') || path.endsWith('.gallery') || path.endsWith('.bullets') || path.endsWith('.deliverables') || path==='about.current' || path==='about.tools' || path==='resume.capabilities' || path==='labels.flowSteps' || path==='labels.aboutArtWords' || path.endsWith('.services')) {
      value = value.split('\n').map(x=>x.trim()).filter(Boolean);
    }
    setPath(draft,path,value);
  }

  main.addEventListener('input', e => {
    if (e.target.matches('[data-path]')) commitField(e.target);
    if (e.target.matches('[data-check-path]')) setPath(draft,e.target.dataset.checkPath,e.target.checked);
  });

  main.addEventListener('click', e => {
    const tab=e.target.closest('[data-tab]'); if(tab){ const id=tab.dataset.tab; document.querySelectorAll('[data-tab]').forEach(x=>x.classList.toggle('active',x===tab)); document.querySelectorAll('[data-panel]').forEach(x=>x.classList.toggle('active',x.dataset.panel===id)); return; }
    const action=e.target.closest('[data-action]'); if(action){
      const a=action.dataset.action;
      if(a==='preview'){ localStorage.setItem('PORTFOLIO_PREVIEW',JSON.stringify(draft)); alert('Preview saved. Open or refresh the website pages to see the changes.'); }
      if(a==='reset'){ localStorage.removeItem('PORTFOLIO_PREVIEW'); draft=structuredClone(original); render(currentTab()); }
      if(a==='download') download('content.js',`window.PORTFOLIO_CONTENT = ${JSON.stringify(draft,null,2)};\n`,'text/javascript');
      if(a==='json') download('portfolio-content-backup.json',JSON.stringify(draft,null,2),'application/json');
      return;
    }
    const add=e.target.closest('[data-add]'); if(add){ const k=add.dataset.add; addItem(k); render(currentTab()); return; }
    const rem=e.target.closest('[data-remove]'); if(rem){ const k=rem.dataset.remove; const i=Number(rem.dataset.index); draft[k].splice(i,1); render(currentTab()); return; }
    const mv=e.target.closest('[data-move]'); if(mv){ const k=mv.dataset.move; const i=Number(mv.dataset.index), d=Number(mv.dataset.dir), j=i+d; if(j>=0&&j<draft[k].length){ [draft[k][i],draft[k][j]]=[draft[k][j],draft[k][i]]; } render(currentTab()); return; }
  });

  function addItem(k){
    if(k==='services') draft.services.push('New service');
    if(k==='disciplines') draft.disciplines.push({number:String(draft.disciplines.length+1).padStart(2,'0'),title:'New discipline',body:'Describe the discipline.'});
    if(k==='experience') draft.experience.push({role:'New role',organisation:'Organisation',period:'Period',location:'Location',bullets:['Add a responsibility or result.']});
    if(k==='education') draft.education.push({qualification:'Qualification',institution:'Institution',period:'Period',detail:'Detail'});
    if(k==='studies') draft.studies.push({id:'new-study',title:'New study',category:'Category',thumb:'assets/placeholder.svg',video:''});
    if(k==='projects') draft.projects.push({id:'new-project',number:String(draft.projects.length+1).padStart(2,'0'),title:'New Project',client:'Client',category:'Category',year:new Date().getFullYear().toString(),role:'Role',type:'campaign',tools:[],short:'Short description',brief:'Project brief',approach:'Creative approach',outcome:'Outcome',tags:[],accent:'#601E2D',cardTone:'burgundy',layout:'medium',featured:false,thumb:'assets/placeholder.svg',hero:'assets/placeholder.svg',gallery:[],video:'',poster:'',deliverables:[]});
  }

  function download(name, text, type){ const blob=new Blob([text],{type}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1000); }

  render();
})();
