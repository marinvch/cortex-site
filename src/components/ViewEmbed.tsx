import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined'
import { facts } from '../facts'

// The real Cortex View of the Cortex repository, not a screenshot of one. The file is
// public/cortex-view-demo.html, rendered by `node index/cortex-view.mjs` over a fresh clone of
// marinvch/Cortex during /sync-website — a working checkout would publish its uncommitted memory
// digests. It is self-contained, so the frame needs nothing but the one request for the file.
const SRC = `${import.meta.env.BASE_URL}cortex-view-demo.html`

export default function ViewEmbed() {
  return (
    <figure className="view-embed">
      <figcaption>
        <span className="view-embed-label">Live</span>
        <span>
          This is <code>/repo-map</code> run on Cortex’s own repository at v{facts.version}. Click
          a tab, a point on the graph or a file.
        </span>
        <a href={SRC} target="_blank" rel="noopener noreferrer" className="view-embed-open">
          Open full page <OpenInNewOutlinedIcon fontSize="inherit" />
        </a>
      </figcaption>
      <iframe src={SRC} title="Cortex View of the Cortex repository" loading="lazy" />
    </figure>
  )
}
