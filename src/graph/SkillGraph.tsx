import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ForceGraph3D, { type ForceGraphMethods } from 'react-force-graph-3d'
import SpriteText from 'three-spritetext'
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  FogExp2,
  Group,
  Points,
  PointsMaterial,
} from 'three'
import { skills, clusterMeta } from '../content/skills'
import { masteryColor, useProgressStore } from '../progress/store'

interface GraphNode {
  id: string
  name: string
  cluster: string
  mastery: number
  val: number
}

interface GraphLink {
  source: string
  target: string
}

function createStarfield(count = 2200) {
  const geometry = new BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    // Spherical shell — galaxy feel around the skill cluster
    const radius = 180 + Math.random() * 420
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)

    // Slight teal / warm mix, not purple
    const tint = Math.random()
    const c = new Color()
    if (tint > 0.85) c.setRGB(0.75, 0.9, 0.85)
    else if (tint > 0.7) c.setRGB(0.95, 0.88, 0.7)
    else c.setRGB(0.85, 0.9, 0.92)
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }

  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('color', new BufferAttribute(colors, 3))

  const material = new PointsMaterial({
    size: 1.1,
    sizeAttenuation: true,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    depthWrite: false,
  })

  return new Points(geometry, material)
}

export function SkillGraph() {
  const selectSkill = useProgressStore((s) => s.selectSkill)
  const masteryOf = useProgressStore((s) => s.masteryOf)
  const bySkill = useProgressStore((s) => s.bySkill)
  void bySkill

  const wrapRef = useRef<HTMLDivElement>(null)
  const fgRef = useRef<ForceGraphMethods<GraphNode, GraphLink> | undefined>(undefined)
  const [size, setSize] = useState({ w: 600, h: 500 })

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect
      setSize({ w: Math.max(320, width), h: Math.max(280, height) })
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Stars + soft fog (previous “galaxy” atmosphere)
  useEffect(() => {
    const fg = fgRef.current
    if (!fg) return

    const scene = fg.scene()
    const stars = createStarfield()
    scene.add(stars)
    scene.fog = new FogExp2(0x0c1412, 0.0018)

    return () => {
      scene.remove(stars)
      stars.geometry.dispose()
      ;(stars.material as PointsMaterial).dispose()
      scene.fog = null
    }
  }, [size.w, size.h])

  const graphData = useMemo(() => {
    const nodes: GraphNode[] = skills.map((s) => ({
      id: s.id,
      name: s.title,
      cluster: s.cluster,
      mastery: masteryOf(s.id),
      val: 1.6 + masteryOf(s.id) * 2.2,
    }))

    const seen = new Set<string>()
    const links: GraphLink[] = []
    for (const s of skills) {
      for (const t of s.links ?? []) {
        const key = [s.id, t].sort().join('::')
        if (seen.has(key)) continue
        seen.add(key)
        links.push({ source: s.id, target: t })
      }
    }
    return { nodes, links }
  }, [masteryOf, bySkill])

  /** Label floats above the node — same idea as the first R3F version */
  const paintLabel = useCallback((node: GraphNode) => {
    const group = new Group()
    const sprite = new SpriteText(node.name)
    sprite.color = '#e7eee9'
    sprite.textHeight = 2.8
    sprite.backgroundColor = 'transparent'
    sprite.padding = 0.6
    sprite.center.y = 0
    // Push label clearly above the sphere
    sprite.position.set(0, 10, 0)
    group.add(sprite)
    return group
  }, [])

  return (
    <div className="graph-shell" ref={wrapRef}>
      <ForceGraph3D
        ref={fgRef}
        width={size.w}
        height={size.h}
        graphData={graphData}
        backgroundColor="#0c1412"
        nodeLabel={(n) => (n as GraphNode).name}
        nodeVal="val"
        nodeRelSize={5}
        nodeOpacity={0.95}
        nodeColor={(n) => masteryColor((n as GraphNode).mastery)}
        linkColor={() => 'rgba(126,184,162,0.35)'}
        linkWidth={0.65}
        linkOpacity={0.55}
        nodeThreeObject={paintLabel as never}
        nodeThreeObjectExtend
        onNodeClick={(n) => selectSkill((n as GraphNode).id)}
        cooldownTicks={100}
        d3VelocityDecay={0.32}
        showNavInfo={false}
        controlType="orbit"
      />
      <div className="graph-hint">
        Drag to explore · Scroll to zoom · Click a skill to begin
      </div>
      <div className="graph-clusters">
        {(Object.keys(clusterMeta) as Array<keyof typeof clusterMeta>).map((id) => (
          <span key={id} style={{ color: clusterMeta[id].accent }}>
            ● {clusterMeta[id].label}
          </span>
        ))}
      </div>
    </div>
  )
}
