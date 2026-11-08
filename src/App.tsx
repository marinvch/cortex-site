import { Suspense, lazy, type ComponentType } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import NotFound from './pages/NotFound'
import { ThemeProvider } from './context/ThemeContext'

const Rituals = lazy(() => import('./pages/Rituals'))
const McpBrain = lazy(() => import('./pages/McpBrain'))

const Loader = () => <div className="content-loader" aria-live="polite">Loading…</div>

// Each page's markdown is its own chunk, fetched with the page. Imported eagerly, every page sat in
// the bundle every visitor loads first, to read the one page they opened.
const sources = import.meta.glob<string>('./docs/*.md', { query: '?raw', import: 'default' })

const docs: { path: string; title: string; file: string }[] = [
  { path: '/install', title: 'Installation', file: 'install' },
  { path: '/sequence', title: 'The sequence', file: 'sequence' },
  { path: '/what-lands', title: 'What lands in your repo', file: 'what-lands' },
  { path: '/for-developers', title: 'For developers', file: 'for-developers' },
  { path: '/for-architects', title: 'For architects', file: 'for-architects' },
  { path: '/for-team-leads', title: 'For team leads', file: 'for-team-leads' },
  { path: '/for-project-managers', title: 'For project managers', file: 'for-project-managers' },
  { path: '/for-qa', title: 'For QA', file: 'for-qa' },
  { path: '/index-and-findings', title: 'Index & findings', file: 'index-and-findings' },
  { path: '/cortex-view', title: 'Cortex View', file: 'cortex-view' },
  { path: '/context-layer', title: 'The context layer', file: 'context-layer' },
  { path: '/team-memory', title: 'Team memory', file: 'team-memory' },
  { path: '/cli', title: 'CLI reference', file: 'cli' },
  { path: '/principles', title: 'Design principles', file: 'principles' },
  { path: '/vault', title: 'Personal vault', file: 'vault' },
  { path: '/privacy', title: 'Privacy & firewall', file: 'privacy' },
  { path: '/contributing', title: 'Contributing', file: 'contributing' },
  { path: '/migrate', title: 'Moving off the old engine', file: 'migrate' },
]

// A page that shows something as well as describing it. The component loads with its page, so the
// other pages do not carry it.
const visuals: Record<string, () => Promise<{ default: ComponentType }>> = {
  'cortex-view': () => import('./components/ViewEmbed'),
}

const pages = docs.map(d => {
  const load = sources[`./docs/${d.file}.md`]
  if (!load) throw new Error(`no src/docs/${d.file}.md for ${d.path}`)
  const Page = lazy(async () => {
    const [content, { default: DocPage }, visual] = await Promise.all([
      load(),
      import('./pages/DocPage'),
      visuals[d.file]?.(),
    ])
    const Visual = visual?.default
    return { default: () => <DocPage title={d.title} content={content} afterIntro={Visual && <Visual />} /> }
  })
  return { path: d.path, Page }
})

// Hash routes the old engine's site published. Links to them still exist in the wild, so each
// lands on the page that replaced it rather than on a 404.
const redirects: Record<string, string> = {
  '/getting-started': '/install',
  '/mcp-tools': '/mcp',
  '/memory': '/team-memory',
  '/architecture': '/principles',
  '/configuration': '/migrate',
  '/profiles': '/migrate',
  '/dry-run': '/migrate',
  '/json-output': '/migrate',
}

export default function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <Layout>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              {pages.map(({ path, Page }) => (
                <Route key={path} path={path} element={<Page />} />
              ))}
              <Route path="/rituals" element={<Rituals />} />
              <Route path="/mcp" element={<McpBrain />} />
              {Object.entries(redirects).map(([from, to]) => (
                <Route key={from} path={from} element={<Navigate to={to} replace />} />
              ))}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </Layout>
      </HashRouter>
    </ThemeProvider>
  )
}
