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
  type Object3D,
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

/** Distant point stars — keep a clear void around the skill constellation */
function createStarfield(count = 3500, minRadius = 280, maxRadius = 1400) {
  const geometry = new BufferGeometry()
  const positions = new Float32Array(count * 3)
  const colors = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const radius = minRadius + Math.random() ** 0.7 * (maxRadius - minRadius)
    const theta = Math.random() * Math.PI * 2
    const phi = Math.acos(2 * Math.random() - 1)
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta)
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta)
    positions[i * 3 + 2] = radius * Math.cos(phi)

    const tint = Math.random()
    const c = new Color()
    if (tint > 0.9) c.setRGB(0.7, 0.88, 0.82)
    else if (tint > 0.78) c.setRGB(0.95, 0.9, 0.72)
    else c.setRGB(0.78, 0.84, 0.9)
    colors[i * 3] = c.r
    colors[i * 3 + 1] = c.g
    colors[i * 3 + 2] = c.b
  }

  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('color', new BufferAttribute(colors, 3))

  return new Points(
    geometry,
    new PointsMaterial({
      size: 0.45,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      depthWrite: false,
    }),
  )
}

/** Soft spiral disk — a far-away galaxy silhouette */
function createSpiralGalaxy(opts: {
  particles?: number
  radius?: number
  arms?: number
  twists?: number
  thickness?: number
  coreColor: [number, number, number]
  armColor: [number, number, number]
  position: [number, number, number]
  rotation: [number, number, number]
  scale?: number
}) {
  const {
    particles = 4200,
    radius = 220,
    arms = 3,
    twists = 2.4,
    thickness = 14,
    coreColor,
    armColor,
    position,
    rotation,
    scale = 1,
  } = opts

  const geometry = new BufferGeometry()
  const positions = new Float32Array(particles * 3)
  const colors = new Float32Array(particles * 3)
  const core = new Color().setRGB(...coreColor)
  const arm = new Color().setRGB(...armColor)

  for (let i = 0; i < particles; i++) {
    const armIndex = i % arms
    const t = Math.random()
    // Denser toward core
    const r = radius * t * t
    const swirl = (r / radius) * twists * Math.PI * 2
    const base = (armIndex / arms) * Math.PI * 2
    const spread = (Math.random() - 0.5) * 0.55
    const theta = base + swirl + spread

    const y = (Math.random() + Math.random() - 1) * thickness * (1 - t * 0.7)

    positions[i * 3] = r * Math.cos(theta)
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = r * Math.sin(theta)

    const mix = Math.min(1, r / (radius * 0.35) + Math.random() * 0.15)
    const c = core.clone().lerp(arm, mix)
    // Soft falloff toward rim
    const fade = 0.35 + 0.65 * (1 - t)
    colors[i * 3] = c.r * fade
    colors[i * 3 + 1] = c.g * fade
    colors[i * 3 + 2] = c.b * fade
  }

  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('color', new BufferAttribute(colors, 3))

  const points = new Points(
    geometry,
    new PointsMaterial({
      size: 1.6,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
    }),
  )

  const group = new Group()
  group.add(points)
  group.position.set(...position)
  group.rotation.set(...rotation)
  group.scale.setScalar(scale)
  return group
}

function disposeObject(obj: Object3D) {
  obj.traverse((child) => {
    const pts = child as Points
    if (pts.isPoints) {
      pts.geometry.dispose()
      const mat = pts.material
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
      else mat.dispose()
    }
  })
}

export function SkillGraph() {
  const selectSkill = useProgressStore((s) => s.selectSkill)
  const masteryOf = useProgressStore((s) => s.masteryOf)
  const bySkill = useProgressStore((s) => s.bySkill)
  void bySkill

  const wrapRef = useRef<HTMLDivElement>(null)
  const fgRef = useRef<ForceGraphMethods<GraphNode, GraphLink> | undefined>(undefined)
  const framedRef = useRef(false)
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

  // Universe backdrop: void near constellation, stars far, galaxies farther
  useEffect(() => {
    const fg = fgRef.current
    if (!fg) return

    const scene = fg.scene()
    const cosmos = new Group()
    cosmos.name = 'cosmos'

    const stars = createStarfield(3800, 300, 1600)
    cosmos.add(stars)

    cosmos.add(
      createSpiralGalaxy({
        particles: 5200,
        radius: 260,
        arms: 4,
        twists: 2.8,
        thickness: 18,
        coreColor: [0.95, 0.92, 0.78],
        armColor: [0.35, 0.7, 0.62],
        position: [-720, -80, -980],
        rotation: [0.55, 0.4, 0.2],
        scale: 1.35,
      }),
    )
    cosmos.add(
      createSpiralGalaxy({
        particles: 3800,
        radius: 180,
        arms: 3,
        twists: 2.1,
        thickness: 12,
        coreColor: [0.92, 0.85, 0.7],
        armColor: [0.45, 0.55, 0.72],
        position: [900, 140, -860],
        rotation: [-0.35, 1.1, 0.15],
        scale: 1.1,
      }),
    )
    cosmos.add(
      createSpiralGalaxy({
        particles: 3000,
        radius: 140,
        arms: 2,
        twists: 1.7,
        thickness: 10,
        coreColor: [0.9, 0.8, 0.65],
        armColor: [0.55, 0.45, 0.35],
        position: [200, -320, 1100],
        rotation: [1.1, -0.3, 0.5],
        scale: 0.95,
      }),
    )
    cosmos.add(
      createSpiralGalaxy({
        particles: 2400,
        radius: 120,
        arms: 5,
        twists: 3.2,
        thickness: 9,
        coreColor: [0.85, 0.9, 0.95],
        armColor: [0.3, 0.55, 0.5],
        position: [-1050, 260, 420],
        rotation: [0.2, -0.8, 0.9],
        scale: 0.85,
      }),
    )

    scene.add(cosmos)
    // Light fog — keeps depth without swallowing the constellation from afar
    scene.fog = new FogExp2(0x0c1412, 0.00055)

    const controls = fg.controls() as { minDistance?: number; maxDistance?: number }
    if (controls) {
      controls.minDistance = 60
      controls.maxDistance = 900
    }

    // Establishing shot — whole constellation visible as a small island in space
    fg.cameraPosition({ x: 55, y: 180, z: 480 }, { x: 0, y: 0, z: 0 }, 0)
    framedRef.current = false

    return () => {
      scene.remove(cosmos)
      disposeObject(cosmos)
      scene.fog = null
    }
  }, [size.w, size.h])

  const graphData = useMemo(() => {
    const nodes: GraphNode[] = skills.map((s) => ({
      id: s.id,
      name: s.title,
      cluster: s.cluster,
      mastery: masteryOf(s.id),
      val: 2.2 + masteryOf(s.id) * 2.4,
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

  const paintLabel = useCallback((node: GraphNode) => {
    const group = new Group()
    const sprite = new SpriteText(node.name)
    sprite.color = '#e7eee9'
    sprite.textHeight = 2.8
    sprite.backgroundColor = 'transparent'
    sprite.padding = 0.6
    sprite.center.y = 0
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
        nodeRelSize={6}
        nodeOpacity={0.96}
        nodeColor={(n) => masteryColor((n as GraphNode).mastery)}
        linkColor={() => 'rgba(126,184,162,0.4)'}
        linkWidth={0.7}
        linkOpacity={0.6}
        nodeThreeObject={paintLabel as never}
        nodeThreeObjectExtend
        onNodeClick={(n) => selectSkill((n as GraphNode).id)}
        onEngineStop={() => {
          if (framedRef.current) return
          framedRef.current = true
          fgRef.current?.cameraPosition(
            { x: 55, y: 180, z: 480 },
            { x: 0, y: 0, z: 0 },
            900,
          )
        }}
        cooldownTicks={80}
        d3VelocityDecay={0.35}
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
