import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import TopNav from '../components/TopNav'
import Footer from '../sections/Footer'
import { portfolioProjects } from '../data/portfolioProjects'
import { useLocale, useTranslation } from '../i18n/LocaleProvider'
import LocalizedLink from '../i18n/LocalizedLink'
import { SchemaOrg, SEOMeta } from '../components/SEOMeta'
import { buildGallery, findProjectId, projectSlug, toStill, type GalleryBlock, type Still } from '../data/projectPages'
import './ProjectDetail.css'

gsap.registerPlugin(SplitText)

// Stills shown in the big editorial layout; the rest go to a compact grid.
const EDITORIAL_STILLS = 14
const pad = (n: number) => String(n).padStart(2, '0')

function ProjectFilm({ embedUrl, cover, title }: { embedUrl: string; cover: string; title: string }) {
  const frameRef = useRef<HTMLIFrameElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const [slow, setSlow] = useState(false)
  const { t } = useTranslation()
  const youtube = /youtube(?:-nocookie)?\.com\/embed\//i.test(embedUrl)
  const vimeo = /player\.vimeo\.com\/video\//i.test(embedUrl)
  const match = embedUrl.match(/(?:embed\/|video\/)([^?&/]+)/i)
  const watchLink = youtube && match ? `https://www.youtube.com/watch?v=${match[1]}` : vimeo && match ? `https://vimeo.com/${match[1]}` : embedUrl
  const platform = youtube ? 'YouTube' : vimeo ? 'Vimeo' : t('portfolio.detail.film')
  const src = `${embedUrl}?autoplay=1&muted=1&playsinline=1${youtube ? `&enablejsapi=1&origin=${encodeURIComponent(window.location.origin)}` : ''}${vimeo ? '&api=1&dnt=1' : ''}`

  useEffect(() => {
    if (!playing || ready) return
    const onMessage = (event: MessageEvent) => {
      if (event.source === frameRef.current?.contentWindow) setReady(true)
    }
    window.addEventListener('message', onMessage)
    const timeout = window.setTimeout(() => setSlow(true), 6000)
    return () => {
      window.removeEventListener('message', onMessage)
      window.clearTimeout(timeout)
    }
  }, [playing, ready])

  const announceReady = () => {
    const frame = frameRef.current?.contentWindow
    if (!frame) return
    try {
      frame.postMessage(JSON.stringify({ method: 'ping' }), 'https://player.vimeo.com')
      frame.postMessage(JSON.stringify({ event: 'listening', id: 1, channel: 'widget' }), 'https://www.youtube-nocookie.com')
    } catch {
      // The cover remains visible if the embedded player cannot be reached.
    }
  }

  return (
    <div className={`project-detail__film-frame ${ready ? 'is-ready' : ''}`} style={{ backgroundImage: `url(${cover})` }}>
      {playing ? (
        <>
          <iframe ref={frameRef} src={src} title={`${title} — ${t('portfolio.detail.film')}`} allow="autoplay; picture-in-picture" allowFullScreen loading="eager" onLoad={announceReady} />
          {!ready && !slow && <span className="project-detail__film-loading" role="status">{t('portfolio.detail.loadingFilm')}</span>}
          {slow && !ready && <a className="project-detail__film-fallback" href={watchLink} target="_blank" rel="noopener noreferrer">{t('portfolio.modal.watchOn', { platform })} ↗</a>}
        </>
      ) : (
        <button type="button" className="project-detail__film-play" onClick={() => setPlaying(true)} aria-label={`${t('portfolio.labels.play')}: ${title}`}>
          <span aria-hidden="true">▶</span>{t('portfolio.labels.play')}
        </button>
      )}
    </div>
  )
}

function ProjectDetailPage({ projectId }: { projectId: string }) {
  const navigate = useNavigate()
  const { locale, localizePath } = useLocale()
  const { t, tm } = useTranslation()
  const heroRef = useRef<HTMLElement | null>(null)
  const storyRef = useRef<HTMLElement | null>(null)
  const galleryRef = useRef<HTMLElement | null>(null)
  const endRef = useRef<HTMLDivElement | null>(null)
  const [pastHero, setPastHero] = useState(false)
  const [atEnd, setAtEnd] = useState(false)
  type Copy = { id: string; title: string; description: string; context: string; outcome: string; tag: string; story?: string[]; highlight?: string }
  const translated = tm<Copy[]>('portfolio.videos')
  const projects = useMemo(() => portfolioProjects.map((project) => ({
    ...project,
    ...(translated.find((entry) => entry.id === project.id) ?? {}),
  })), [translated])
  const match = findProjectId(projectId, projects.map((project) => project.id))
  const index = match ? projects.findIndex((project) => project.id === match.id) : -1
  const project = index >= 0 ? (projects[index] as (typeof projects)[number] & Partial<Copy>) : undefined
  const slug = project ? projectSlug(project.id) : ''

  // Hero = the sharper of the card cover and the first still; the remaining
  // stills feed the editorial gallery (first ones) and the compact grid.
  const media = useMemo(() => {
    if (!project) return null
    const stills = (project.slideshowImages?.length ? project.slideshowImages : [project.thumb]).map(toStill)
    const cover = toStill(project.thumb)
    const first = stills[0]
    const hero = first && Math.max(first.w, first.h) >= Math.max(cover.w, cover.h) ? first : cover
    const rest = stills.filter((still) => still.src !== hero.src)
    return {
      hero,
      blocks: buildGallery(rest.slice(0, EDITORIAL_STILLS)),
      more: rest.slice(EDITORIAL_STILLS),
    }
  }, [project])

  const navigateHomeToSection = (sectionId: string) => {
    navigate(locale === 'de' ? '/de' : '/')
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
      })
    })
  }

  // Nav over the hero photo: white-on-dark; past it: themed bar. The mobile
  // project bar appears once the hero has scrolled away and hides again at the
  // end of the page, where the full next-project teaser takes over.
  useLayoutEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    const root = document.documentElement
    const previousMediaState = root.hasAttribute('data-nav-over-media')
    root.setAttribute('data-nav-over-media', '')
    const heroObserver = new IntersectionObserver(([entry]) => {
      root.toggleAttribute('data-nav-over-media', entry.isIntersecting)
      setPastHero(!entry.isIntersecting && entry.boundingClientRect.top < 0)
    })
    heroObserver.observe(hero)
    const end = endRef.current
    const endObserver = new IntersectionObserver(([entry]) => setAtEnd(entry.isIntersecting))
    if (end) endObserver.observe(end)

    return () => {
      heroObserver.disconnect()
      endObserver.disconnect()
      root.toggleAttribute('data-nav-over-media', previousMediaState)
    }
  }, [projectId])

  useLayoutEffect(() => {
    // Arriving from another project (e.g. the next-project teaser at the very
    // bottom), the window is still scrolled down while this effect runs; the
    // app-level scroll reset only happens after children mount. Reset first so
    // every trigger below is measured from the top.
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' as ScrollBehavior })
    if (!heroRef.current || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let cancelled = false
    const context = gsap.context(() => {
      // Hero: the photo settles in, the copy rises, then slow parallax.
      gsap.fromTo('.project-detail__cover', { scale: 1.14 }, { scale: 1, duration: 1.8, ease: 'expo.out' })
      gsap.fromTo(
        '.project-detail__hero-copy > *',
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.09, delay: 0.15 },
      )
      gsap.to('.project-detail__cover-wrap', {
        yPercent: 14,
        ease: 'none',
        scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
      })

      // Story copy and facts: every piece gets its own reveal instead of the
      // section fading in as one block. Headline words rise out of a line mask,
      // paragraphs follow line by line, and each fact row draws its rule before
      // the label and value settle in. Built once webfonts are in, so SplitText measures the real line breaks
      // (the section sits below the fold, so the wait is never visible).
      const story = storyRef.current
      const buildStory = () => {
        if (!story) return
        const storyTl = gsap.timeline({ scrollTrigger: { trigger: story, start: 'top 80%', toggleActions: 'play none none none' } })
        const eyebrow = story.querySelector('.project-detail__story-copy > .project-detail__eyebrow')
        if (eyebrow) storyTl.fromTo(eyebrow, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out' }, 0)

        const heading = story.querySelector('.project-detail__story-copy > h2')
        if (heading) {
          const split = SplitText.create(heading, { type: 'lines,words', mask: 'lines', linesClass: 'pd-line' })
          storyTl.fromTo(split.words, { yPercent: 115, rotate: 3 }, { yPercent: 0, rotate: 0, duration: 1.25, ease: 'expo.out', stagger: 0.07 }, 0.12)
        }

        story.querySelectorAll<HTMLElement>('.project-detail__story-copy > p:not(.project-detail__eyebrow)').forEach((paragraph, i) => {
          const split = SplitText.create(paragraph, { type: 'lines', mask: 'lines', linesClass: 'pd-line' })
          storyTl.fromTo(split.lines, { yPercent: 105, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 1.05, ease: 'expo.out', stagger: 0.08 }, 0.45 + i * 0.22)
        })

        story.querySelectorAll<HTMLElement>('.project-detail__facts > div').forEach((row, i) => {
          const at = 0.3 + i * 0.16
          storyTl.fromTo(row, { '--rule': 0 }, { '--rule': 1, duration: 1.2, ease: 'expo.inOut' }, at)
          storyTl.fromTo(row.querySelector('dt'), { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: 0.9, ease: 'expo.out' }, at + 0.25)
          storyTl.fromTo(row.querySelector('dd'), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 1, ease: 'expo.out' }, at + 0.35)
        })
        const facts = story.querySelector('.project-detail__facts')
        if (facts) storyTl.fromTo(facts, { '--rule': 0 }, { '--rule': 1, duration: 1.2, ease: 'expo.inOut' }, 0.15)
        ScrollTrigger.refresh()
      }
      document.fonts.ready.then(() => { if (!cancelled) context.add(buildStory) })

      // Gallery: each image is unveiled upward while it eases out of a zoom.
      gsap.utils.toArray<HTMLElement>('.project-detail__reveal').forEach((frame) => {
        const img = frame.querySelector('img')
        const timeline = gsap.timeline({ scrollTrigger: { trigger: frame, start: 'top 88%', toggleActions: 'play none none none' } })
        timeline.fromTo(frame, { clipPath: 'inset(18% 0% 0% 0%)', y: 40 }, { clipPath: 'inset(0% 0% 0% 0%)', y: 0, duration: 1.3, ease: 'expo.out' })
        if (img) timeline.fromTo(img, { scale: 1.18 }, { scale: 1, duration: 1.6, ease: 'expo.out' }, 0)
      })

      // Full-bleed images drift slightly against the scroll.
      gsap.utils.toArray<HTMLElement>('.project-detail__block--full .project-detail__drift').forEach((drift) => {
        gsap.fromTo(drift, { yPercent: -6 }, {
          yPercent: 6,
          ease: 'none',
          scrollTrigger: { trigger: drift, start: 'top bottom', end: 'bottom top', scrub: true },
        })
      })

      // Highlight line, then the compact grid in small batches.
      gsap.fromTo('.project-detail__highlight p', { opacity: 0, y: 50 }, {
        opacity: 1, y: 0, ease: 'none',
        scrollTrigger: { trigger: '.project-detail__highlight', start: 'top 85%', end: 'top 45%', scrub: 0.6 },
      })
      gsap.set('.project-detail__more-grid figure', { opacity: 0, y: 30 })
      ScrollTrigger.batch('.project-detail__more-grid figure', {
        start: 'top 92%',
        // No `once`: a trigger that kills itself during ScrollTrigger's refresh
        // crashed the page (V2-035). Re-entering just replays to the same state.
        onEnter: (batch) => gsap.to(batch, { opacity: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07, overwrite: true }),
      })

      // Next-project teaser: image eases in as it arrives.
      gsap.fromTo('.project-detail__next-media img', { scale: 1.15 }, {
        scale: 1, ease: 'none',
        scrollTrigger: { trigger: '.project-detail__next', start: 'top bottom', end: 'bottom bottom', scrub: true },
      })
    }, galleryRef.current?.parentElement ?? undefined)

    return () => {
      cancelled = true
      context.revert()
    }
  }, [projectId])

  if (!project || !media) {
    return <Navigate to={localizePath('/portfolio')} replace />
  }
  if (match?.isLegacy) {
    // Old /projects/v1-style links keep working.
    return <Navigate to={localizePath(`/projects/${slug}`)} replace />
  }

  const total = projects.length
  const previous = projects[(index - 1 + total) % total]
  const next = projects[(index + 1) % total]
  const story = project.story?.length ? project.story : [`${project.description} ${t('portfolio.detail.story')}`]
  const alt = (n: number) => `${project.title} — ${t('portfolio.detail.image')} ${n}`
  let photoNumber = 1

  const renderImage = (still: Still, className = '') => {
    const n = photoNumber++
    return (
      <figure className={`project-detail__reveal ${className}`.trim()}>
        <div className="project-detail__drift">
          <img src={still.src} width={still.w} height={still.h} alt={alt(n)} loading="lazy" decoding="async" />
        </div>
      </figure>
    )
  }

  const renderBlock = (block: GalleryBlock, blockIndex: number) => {
    if (block.kind === 'full') return <div className="project-detail__block project-detail__block--full" key={blockIndex}>{renderImage(block.a)}</div>
    if (block.kind === 'single') {
      return <div className={`project-detail__block project-detail__block--single is-${block.side}`} key={blockIndex}>{renderImage(block.a)}</div>
    }
    return (
      <div className={`project-detail__block project-detail__block--${block.kind}`} key={blockIndex}>
        {renderImage(block.a)}
        {renderImage(block.b, 'is-offset')}
      </div>
    )
  }

  const navLinks = {
    left: [
      { id: 'home', label: t('nav.home'), onClick: () => navigate(locale === 'de' ? '/de' : '/') },
      { id: 'services', label: t('nav.services'), onClick: () => navigateHomeToSection('cases') },
    ],
    right: [
      { id: 'about', label: t('nav.about'), onClick: () => navigate(locale === 'de' ? '/de/about' : '/about') },
      { id: 'contact', label: t('nav.contact'), onClick: () => navigate(locale === 'de' ? '/de/contact' : '/contact') },
    ],
  }
  const highlightAfter = Math.min(2, media.blocks.length)

  return (
    <main className="home home--v2 project-detail" id="main">
      <SEOMeta
        title={`${project.title} — ${project.tag}`}
        description={project.description}
        canonical={`https://expose-u.com/projects/${slug}`}
        ogImage={project.thumb}
        lang={locale}
      />
      <div className="home__nav">
        <TopNav
          className="top-nav--page"
          leftLinks={navLinks.left}
          rightLinks={navLinks.right}
          onBrandClick={() => navigate(locale === 'de' ? '/de' : '/')}
          brandLabel={t('nav.brand')}
        />
      </div>

      <header className="project-detail__hero" ref={heroRef}>
        <div className="project-detail__cover-wrap">
          <img
            className="project-detail__cover"
            src={media.hero.src}
            width={media.hero.w}
            height={media.hero.h}
            alt=""
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="project-detail__shade" />
        <div className="project-detail__hero-copy">
          <LocalizedLink to="/portfolio" className="project-detail__back">← {t('portfolio.detail.back')}</LocalizedLink>
          <p className="project-detail__eyebrow">
            {project.tag} <span>·</span> {project.location} <span>·</span> {project.year}
            <span className="project-detail__count">{pad(index + 1)} / {pad(total)}</span>
          </p>
          <h1>{project.title}</h1>
          <p className="project-detail__intro">{project.description}</p>
        </div>
        <a className="home__video-scroll-hint project-detail__scroll" href="#project-story" aria-label={t('portfolio.detail.explore')}>
          <span>{t('portfolio.detail.explore')}</span>
          <span aria-hidden="true">↓</span>
        </a>
      </header>

      <section className="project-detail__story" id="project-story" ref={storyRef}>
        <div className="project-detail__story-copy">
          <p className="project-detail__eyebrow">{t('portfolio.detail.project')}</p>
          <h2>{project.context}</h2>
          {story.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <dl className="project-detail__facts">
          <div><dt>{t('portfolio.labels.context')}</dt><dd>{project.context}</dd></div>
          <div><dt>{t('portfolio.labels.outcome')}</dt><dd>{project.outcome}</dd></div>
          <div><dt>{t('portfolio.detail.location')}</dt><dd>{project.location} · {project.year}</dd></div>
        </dl>
      </section>

      {project.embedUrl && (
        <section className="project-detail__film" aria-label={t('portfolio.detail.film')}>
          <ProjectFilm embedUrl={project.embedUrl} cover={project.thumb} title={project.title} />
        </section>
      )}

      <section className="project-detail__gallery" aria-label={t('portfolio.detail.gallery')} ref={galleryRef}>
        <div className="project-detail__gallery-heading">
          <p className="project-detail__eyebrow">{t('portfolio.detail.gallery')}</p>
          <h2>{t('portfolio.detail.galleryTitle')}</h2>
        </div>
        <div className="project-detail__blocks">
          {media.blocks.slice(0, highlightAfter).map(renderBlock)}
          {project.highlight && (
            <blockquote className="project-detail__highlight"><p>{project.highlight}</p></blockquote>
          )}
          {media.blocks.slice(highlightAfter).map((block, i) => renderBlock(block, i + highlightAfter))}
        </div>
        {media.more.length > 0 && (
          <div className="project-detail__more">
            <p className="project-detail__eyebrow">{t('portfolio.detail.moreFrames')}</p>
            <div className="project-detail__more-grid">
              {media.more.map((still) => {
                const n = photoNumber++
                return (
                  <figure key={still.src}>
                    <img src={still.src} width={still.w} height={still.h} alt={alt(n)} loading="lazy" decoding="async" />
                  </figure>
                )
              })}
            </div>
          </div>
        )}
      </section>

      {project.credits && project.credits.length > 0 && (
        <section className="project-detail__credits" aria-labelledby="project-credits-title">
          <p className="project-detail__eyebrow" id="project-credits-title">{t('portfolio.detail.credits')}</p>
          <dl>
            {project.credits.map((credit) => (
              <div key={credit.role}>
                <dt>{credit.role}</dt>
                <dd>{credit.names}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      <div ref={endRef}>
        <LocalizedLink to={`/projects/${projectSlug(next.id)}`} className="project-detail__next">
          <div className="project-detail__next-media"><img src={next.thumb} alt="" loading="lazy" decoding="async" /></div>
          <div className="project-detail__next-copy">
            <span className="project-detail__eyebrow">{t('portfolio.detail.viewNext')} · {pad(((index + 1) % total) + 1)} / {pad(total)}</span>
            <strong>{next.title}</strong>
            <span className="project-detail__next-arrow" aria-hidden="true">→</span>
          </div>
        </LocalizedLink>
        <nav className="project-detail__pagination" aria-label={t('portfolio.detail.projectNavigation')}>
          <LocalizedLink to={`/projects/${projectSlug(previous.id)}`}>
            <span>{t('portfolio.detail.previous')}</span><strong>{previous.title}</strong>
          </LocalizedLink>
          <LocalizedLink to="/portfolio">
            <span>{t('portfolio.detail.allProjects')}</span><strong>{t('portfolio.detail.back')} ↗</strong>
          </LocalizedLink>
        </nav>
        <section className="project-detail__cta">
          <p className="project-detail__eyebrow">{t('portfolio.detail.ctaEyebrow')}</p>
          <h2>{t('portfolio.detail.ctaTitle')}</h2>
          <LocalizedLink to="/contact">{t('portfolio.detail.cta')} <span aria-hidden="true">↗</span></LocalizedLink>
        </section>
        <Footer />
      </div>

      {/* Mobile: thumb-reach project navigation (hidden on desktop). */}
      <nav
        className={`project-detail__mobilebar${pastHero && !atEnd ? ' is-visible' : ''}`}
        aria-label={t('portfolio.detail.projectNavigation')}
        aria-hidden={!(pastHero && !atEnd)}
        inert={!(pastHero && !atEnd)}
      >
        <LocalizedLink to="/portfolio" className="project-detail__mobilebar-back">← {t('portfolio.detail.backShort')}</LocalizedLink>
        <span className="project-detail__mobilebar-count" aria-label={t('portfolio.detail.counter', { n: index + 1, total })}>
          {pad(index + 1)} <i>/</i> {pad(total)}
        </span>
        <LocalizedLink to={`/projects/${projectSlug(next.id)}`} className="project-detail__mobilebar-next">{t('portfolio.detail.nextShort')} →</LocalizedLink>
      </nav>

      <SchemaOrg data={{'@context': 'https://schema.org', '@type': 'CreativeWork', name: project.title, description: project.description, image: project.thumb, dateCreated: project.year, locationCreated: {'@type': 'Place', name: project.location}, url: `https://expose-u.com/projects/${slug}`}} />
    </main>
  )
}

// A fresh page instance per project: state, observers and scroll animations
// from the previous project never carry over when navigating between projects.
function ProjectDetail() {
  const { projectId = '' } = useParams()
  return <ProjectDetailPage key={projectId} projectId={projectId} />
}

export default ProjectDetail
