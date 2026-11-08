export interface NavItem {
  label: string
  path: string
}

export interface NavGroup {
  title: string | null
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    title: null,
    items: [{ label: 'Home', path: '/' }],
  },
  {
    title: 'Start',
    items: [
      { label: 'Installation', path: '/install' },
      { label: 'The sequence', path: '/sequence' },
      { label: 'What lands in your repo', path: '/what-lands' },
    ],
  },
  {
    title: 'By role',
    items: [
      { label: 'Developers', path: '/for-developers' },
      { label: 'Architects', path: '/for-architects' },
      { label: 'Team leads', path: '/for-team-leads' },
      { label: 'Project managers', path: '/for-project-managers' },
      { label: 'QA', path: '/for-qa' },
    ],
  },
  {
    title: 'How it works',
    items: [
      { label: 'Index & findings', path: '/index-and-findings' },
      { label: 'Cortex View', path: '/cortex-view' },
      { label: 'The context layer', path: '/context-layer' },
      { label: 'Team memory', path: '/team-memory' },
    ],
  },
  {
    title: 'Reference',
    items: [
      { label: 'Rituals', path: '/rituals' },
      { label: 'MCP brain', path: '/mcp' },
      { label: 'CLI reference', path: '/cli' },
      { label: 'Design principles', path: '/principles' },
    ],
  },
  {
    title: 'More',
    items: [
      { label: 'Personal vault', path: '/vault' },
      { label: 'Privacy & firewall', path: '/privacy' },
      { label: 'Contributing', path: '/contributing' },
      { label: 'Moving off the old engine', path: '/migrate' },
    ],
  },
]
