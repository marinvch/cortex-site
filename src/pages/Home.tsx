import { Suspense, lazy, useState, useEffect, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import GitHubIcon from '@mui/icons-material/GitHub'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined'
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined'
import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined'
import HubOutlinedIcon from '@mui/icons-material/HubOutlined'
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined'
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined'
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined'
import MemoryOutlinedIcon from '@mui/icons-material/MemoryOutlined'
import { facts, installBlock, ritual } from '../facts'
import { InlineMarkdown } from '../components/InlineMarkdown'
import { REPO_URL, SITE_TITLE } from '../site'

// The walkthrough and its captured data load after the page paints; the docs pages never fetch them.
const RunDemo = lazy(() => import('../components/RunDemo'))

interface Feature { icon: ReactNode; title: string; desc: string; to: string }

const features: Feature[] = [
  {
    icon: <TravelExploreOutlinedIcon />,
    title: 'Index & ranked findings',
    desc: 'A deterministic map of the repo — no LLM, no network — and one report of issues and gaps, ranked by severity.',
    to: '/index-and-findings',
  },
  {
    icon: <HubOutlinedIcon />,
    title: 'Cortex View',
    desc: 'The repo as one offline HTML page: an overview of its state, an import graph by area, the context layer as a tree, every file, and the busiest code with no test.',
    to: '/cortex-view',
  },
  {
    icon: <DescriptionOutlinedIcon />,
    title: 'The context layer',
    desc: 'A small root AGENTS.md with a routing table, scoped briefs where they are earned, a glossary and decisions.',
    to: '/context-layer',
  },
  {
    icon: <GroupsOutlinedIcon />,
    title: 'Team memory',
    desc: 'What the team’s agents learn, committed next to the code and synced by git. Secrets are refused at the gate.',
    to: '/team-memory',
  },
  {
    icon: <AutoStoriesOutlinedIcon />,
    title: `${facts.rituals.length} rituals`,
    desc: 'Plain SKILL.md files: install, review a change, trace impact, diagnose a bug, ship, hand off.',
    to: '/rituals',
  },
  {
    icon: <MemoryOutlinedIcon />,
    title: `MCP brain — ${facts.mcpTools.length} tools`,
    desc: 'Live recall over the repo’s memory for any agent that speaks MCP. No dependencies.',
    to: '/mcp',
  },
]

const steps = [ritual('cortex'), ritual('cortex-next'), ritual('cortex-review'), ritual('dream')]

export default function Home() {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    document.title = SITE_TITLE
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(installBlock)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard can be refused (insecure context, permissions); the commands stay selectable.
    }
  }

  return (
    <div>
      <section className="hero">
        <div className="hero-badge">
          <span className="hero-badge-dot" aria-hidden="true" />
          v{facts.version} · Claude plugin · Node {facts.node}
        </div>

        <h1>
          A context manager for <span className="hero-accent">new and legacy codebases</span>
        </h1>

        <p className="hero-lede">
          Cortex indexes a repository, reports what it finds, and — once you say so — writes the
          context layer every developer’s agent reads: a small root brief, scoped briefs where they
          are earned, a domain glossary, decisions, and a shared memory committed with the code.
        </p>

        <p className="section-title">One run</p>
        <Suspense fallback={<div className="run-placeholder" aria-hidden="true" />}>
          <RunDemo />
        </Suspense>

        <div className="install-box">
          <span className="install-box-label">Install in Claude Code</span>
          <pre>{installBlock}</pre>
          <Tooltip title={copied ? 'Copied' : 'Copy the commands'}>
            <IconButton
              className="copy-btn"
              onClick={handleCopy}
              aria-label="Copy the install commands"
              sx={{ color: copied ? '#c3ec96' : '#f3ede4' }}
            >
              {copied ? <CheckOutlinedIcon /> : <ContentCopyOutlinedIcon />}
            </IconButton>
          </Tooltip>
        </div>

        <p style={{ maxWidth: '44rem', margin: '1rem 0 0', fontSize: '1.05rem', lineHeight: 1.6 }}>
          Then turn on auto-update once — Claude Code leaves it off for third-party marketplaces like
          this one, so without it no release reaches you.{' '}
          <Link to="/install" style={{ color: 'var(--accent)', fontWeight: 700 }}>Keeping it current</Link> has the clicks.
        </p>

        <div className="hero-actions">
          <Link to="/install" className="btn btn-primary">
            Get started <ArrowForwardIcon fontSize="small" />
          </Link>
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="btn btn-ghost">
            <GitHubIcon fontSize="small" /> marinvch/Cortex
          </a>
        </div>
      </section>

      <section className="section">
        <p className="section-title">What it does</p>
        <h2>Understand the repo, then write only what you pick</h2>
        <div className="features">
          {features.map(f => (
            <Link key={f.to} to={f.to} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <p className="section-title">The loop</p>
        <h2>Four commands carry most of it</h2>
        <ol className="steps">
          {steps.map(s => (
            <li key={s.name}>
              <span className="step-cmd">/{s.name}</span>
              <span className="step-desc"><InlineMarkdown source={s.does} /></span>
            </li>
          ))}
        </ol>
        <p style={{ marginTop: '1.25rem', fontSize: '1.05rem' }}>
          The whole order, and when to skip a step, is on <Link to="/sequence" style={{ color: 'var(--accent)', fontWeight: 700 }}>the sequence</Link>.
        </p>
      </section>
    </div>
  )
}
