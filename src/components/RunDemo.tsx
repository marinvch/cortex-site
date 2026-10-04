import { useEffect, useMemo, useRef, useState } from 'react'
import raw from '../../site-demo.json'

// A `/cortex` run, played step by step. Steps 1–3 are Cortex's own output: site-demo.json is what
// `node tools/cortex-site-demo.mjs` recorded from the indexer, the findings and the loop on three
// small repos, and /site-sync regenerates it. Steps 4 and 5 are the site's words for what the
// ritual does next — it asks once, then writes the paths each row names. Nothing here is typed in
// by hand except those two framings, so a reworded row shows up as the row, not as drift.

type Status = 'present' | 'missing' | 'blocked'

interface Row { id: string; stage: string; status: Status; title: string; why: string; needs: string[]; paths: string[] }
interface Scenario {
  id: string
  title: string
  blurb: string
  repo: { name: string; files: string[] }
  index: string[]
  findings: { counts: Record<string, number>; items: { severity: string; title: string }[] }
  loop: { greenfield: boolean; served: number; total: number; stages: string[]; rows: Row[] }
}

const demo = raw as { schema: number; version: string; scenarios: Scenario[] }

const STEPS = ['Index', 'Report', 'What is missing', 'One question', 'Write'] as const
const STEP_MS = 2600
const GLYPH: Record<Status, string> = { present: '✓', missing: '→', blocked: '·' }
const SEVERITIES = ['critical', 'high', 'medium', 'low']

interface Line { kind: 'cmd' | 'out' | 'dim' | 'head' | 'add' | 'ask'; text: string }

/** A row's short name: its title up to the dash that starts the explanation. */
const short = (title: string) => title.split(' — ')[0]

/** `CLAUDE.md#Verifying your work` is a section of a file, not a file. */
const filePart = (path: string) => path.split('#')[0]

function countsLine(s: Scenario) {
  const parts = SEVERITIES.filter(k => s.findings.counts[k]).map(k => `${s.findings.counts[k]} ${k}`)
  const n = s.findings.items.length
  return `${n} finding${n === 1 ? '' : 's'}${parts.length ? ` (${parts.join(', ')})` : ''}`
}

function linesFor(s: Scenario, step: number): Line[] {
  const missing = s.loop.rows.filter(r => r.status === 'missing')
  switch (step) {
    case 0:
      return [{ kind: 'cmd', text: '/cortex' }, ...s.index.map(text => ({ kind: 'out' as const, text }))]
    case 1:
      return [
        { kind: 'head', text: countsLine(s) },
        ...s.findings.items.map(f => ({ kind: 'out' as const, text: `${f.severity.padEnd(8)}${f.title}` })),
        { kind: 'dim', text: 'Every item is a proposal. Nothing has been changed.' },
      ]
    case 2:
      return [
        {
          kind: 'head',
          text: s.loop.greenfield
            ? 'Greenfield: no code yet, so the loop grows with it.'
            : `${s.loop.served} of ${s.loop.total} artifacts in place.`,
        },
        ...s.loop.rows.map(r => ({
          kind: (r.status === 'blocked' ? 'dim' : 'out') as Line['kind'],
          text: `${GLYPH[r.status]} ${r.stage.padEnd(9)}${short(r.title)}`,
        })),
      ]
    case 3:
      return [
        { kind: 'ask', text: `Write these ${missing.length} now? One answer covers all of them.` },
        { kind: 'cmd', text: 'yes' },
      ]
    default:
      return missing.flatMap(r => r.paths.map(p => ({ kind: 'add' as const, text: `+ ${p}` })))
  }
}

interface TreeEntry { path: string; note?: string; added: boolean }

/** The repo's files, then — once the write step plays — the paths the missing rows name. */
function treeFor(s: Scenario, step: number): TreeEntry[] {
  const entries = new Map<string, TreeEntry>()
  for (const f of s.repo.files) if (!f.startsWith('.cortex/')) entries.set(f, { path: f, added: false })
  if (step >= 4) {
    for (const row of s.loop.rows.filter(r => r.status === 'missing')) {
      for (const p of row.paths) {
        const file = filePart(p)
        const section = p.includes('#') ? p.split('#')[1] : undefined
        const was = entries.get(file)
        const notes = [was?.note, section].filter(Boolean)
        entries.set(file, { path: file, added: was ? was.added : true, note: notes.length ? notes.join('”, “') : undefined })
      }
    }
  }
  return [...entries.values()].sort((a, b) => a.path.localeCompare(b.path))
}

const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function RunDemo() {
  const last = STEPS.length - 1
  const [which, setWhich] = useState(1) // the working project: the case most visitors have
  const [step, setStep] = useState(() => (reducedMotion() ? last : 0))
  const [playing, setPlaying] = useState(() => !reducedMotion())
  const [seen, setSeen] = useState(false)
  const root = useRef<HTMLDivElement>(null)
  const term = useRef<HTMLDivElement>(null)

  const s = demo.scenarios[which]

  // Play once, and only once it is on screen: a run that finished above the fold taught nobody.
  useEffect(() => {
    const el = root.current
    if (!el || seen) return
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setSeen(true), { threshold: 0.35 })
    io.observe(el)
    return () => io.disconnect()
  }, [seen])

  useEffect(() => {
    if (!playing || !seen) return
    if (step >= last) { setPlaying(false); return }
    const t = setTimeout(() => setStep(n => n + 1), STEP_MS)
    return () => clearTimeout(t)
  }, [playing, seen, step, last])

  // The terminal keeps every step so far and follows the newest line. Only the pane scrolls: a
  // scrollIntoView here would drag the whole page down to the demo on load.
  useEffect(() => {
    const el = term.current
    if (el) el.scrollTop = el.scrollHeight
  }, [step, which])

  const blocks = useMemo(
    () => Array.from({ length: step + 1 }, (_, i) => ({ i, lines: linesFor(s, i) })),
    [s, step],
  )
  const tree = useMemo(() => treeFor(s, step), [s, step])
  const waiting = s.loop.rows.filter(r => r.status === 'blocked')

  const go = (n: number) => { setPlaying(false); setStep(Math.max(0, Math.min(last, n))) }
  const pick = (i: number) => { setWhich(i); setStep(reducedMotion() ? last : 0); setPlaying(!reducedMotion()) }
  const replay = () => { setStep(0); setPlaying(true); setSeen(true) }

  return (
    <div className="run" ref={root}>
      <div className="run-tabs" role="tablist" aria-label="Which repo">
        {demo.scenarios.map((sc, i) => (
          <button
            key={sc.id}
            type="button"
            role="tab"
            id={`run-tab-${sc.id}`}
            aria-selected={i === which}
            aria-controls="run-panel"
            className="run-tab"
            onClick={() => pick(i)}
          >
            {sc.title}
          </button>
        ))}
      </div>

      <div id="run-panel" role="tabpanel" aria-labelledby={`run-tab-${s.id}`}>
        <p className="run-blurb">{s.blurb}</p>

        <div className="run-panes">
          <div className="run-term" ref={term} tabIndex={0} aria-label={`Output of /cortex on ${s.title.toLowerCase()}`}>
            {blocks.map(b => (
              <div key={`${s.id}-${b.i}`} className="run-block">
                <div className="run-block-title">{b.i + 1} · {STEPS[b.i]}</div>
                {b.lines.map((l, n) => (
                  <div
                    key={n}
                    className={`run-line run-${l.kind}${b.i === step ? ' run-new' : ''}`}
                    style={b.i === step ? { animationDelay: `${Math.min(n, 14) * 55}ms` } : undefined}
                  >
                    {l.text || ' '}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div className="run-tree" aria-label={`Files in ${s.repo.name}`}>
            <div className="run-tree-title">{s.repo.name}/</div>
            {tree.length === 0 && <div className="run-tree-empty">empty</div>}
            <ul>
              {tree.map(e => (
                <li key={e.path} className={e.added ? 'run-added' : e.note ? 'run-touched' : undefined}>
                  <span className="run-mark" aria-hidden="true">{e.added ? '+' : e.note ? '~' : ' '}</span>
                  <span>{e.path}</span>
                  {e.note && <span className="run-note">{e.added ? '' : 'adds '}“{e.note}”</span>}
                </li>
              ))}
            </ul>
            {step >= 2 && waiting.length > 0 && (
              <div className="run-waits">
                <div className="run-tree-title">Offered later</div>
                <ul>
                  {waiting.map(r => (
                    <li key={r.id}>
                      <span className="run-mark" aria-hidden="true">·</span>
                      <span>{short(r.title)}</span>
                      {r.needs[0] && <span className="run-note">needs {r.needs[0].split(' — ')[0]}</span>}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div className="run-controls">
          <ol className="run-steps" aria-label="Steps of the run">
            {STEPS.map((name, i) => (
              <li key={name}>
                <button
                  type="button"
                  className="run-step"
                  aria-current={i === step ? 'step' : undefined}
                  data-done={i < step || undefined}
                  onClick={() => go(i)}
                >
                  <span className="run-step-n">{i + 1}</span> {name}
                </button>
              </li>
            ))}
          </ol>
          <button type="button" className="btn btn-ghost run-replay" onClick={replay}>
            Replay
          </button>
        </div>

        <p className="run-foot">
          Steps 1 to 3 are Cortex’s own output, recorded from a real run at v{demo.version}. Step 5
          lists the paths each row names; nothing outside <code>.cortex/</code> is written before
          the one question.
        </p>
      </div>
    </div>
  )
}
