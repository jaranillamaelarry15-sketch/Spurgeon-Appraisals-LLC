import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'

// One fixed WebGL layer for the whole page. In the hero it paints a pastel dusk scene with floating glass
// bubbles; a glossy house floats through the page and re-poses itself for the hero, intro, process and closing sections.

const glossy = (color: number, extra: Partial<THREE.MeshPhysicalMaterialParameters> = {}) =>
  new THREE.MeshPhysicalMaterial({ color, roughness: 0.32, clearcoat: 0.8, clearcoatRoughness: 0.2, ...extra })

function buildHouse() {
  const g = new THREE.Group()
  const add = (geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat)
    m.position.set(x, y, z)
    g.add(m)
    return m
  }
  const RB = (w: number, h: number, d: number, r = 0.08) => new RoundedBoxGeometry(w, h, d, 4, r)
  add(RB(2.7, 0.2, 2.3, 0.1), glossy(0xbfe8c8), 0, -0.1, 0)
  add(RB(1.9, 1.2, 1.5, 0.06), glossy(0xfff6f1), 0, 0.6, 0)
  const s = new THREE.Shape()
  s.moveTo(-1.1, 0)
  s.lineTo(1.1, 0)
  s.lineTo(0, 0.85)
  s.closePath()
  const roofGeo = new THREE.ExtrudeGeometry(s, { depth: 1.8, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 3 })
  roofGeo.translate(0, 0, -0.9)
  add(roofGeo, glossy(0xf59aa8), 0, 1.2, 0)
  const glow = new THREE.MeshPhysicalMaterial({ color: 0xffe2b8, emissive: 0xffb36b, emissiveIntensity: 0.9, roughness: 0.2 })
  add(RB(0.34, 0.38, 0.06, 0.03), glow, -0.5, 0.7, 0.76)
  add(RB(0.34, 0.38, 0.06, 0.03), glow, 0.5, 0.7, 0.76)
  add(RB(0.36, 0.62, 0.06, 0.03), glossy(0xb9a3f7), 0, 0.31, 0.76)
  add(RB(0.22, 0.6, 0.22, 0.03), glossy(0xfff6f1), 0.55, 2.0, -0.3)
  for (const [x, z] of [[-1.1, 0.8], [1.1, 0.85], [-1.0, -0.8]]) {
    add(new THREE.CylinderGeometry(0.05, 0.06, 0.3, 12), glossy(0xc98f6b), x, 0.15, z)
    add(new THREE.SphereGeometry(0.27, 32, 16), glossy(0x9fe0b4), x, 0.5, z)
  }
  g.children.forEach((c) => c.position.y -= 0.8)
  return { group: g, glow }
}

function buildHero() {
  const g = new THREE.Group()
  // Sky dome: lavender at the top, pink in the middle, warm peach at the horizon, with a soft sun.
  const sky = new THREE.Mesh(
    new THREE.SphereGeometry(60, 32, 16),
    new THREE.ShaderMaterial({
      side: THREE.BackSide,
      depthWrite: false,
      uniforms: {},
      vertexShader: 'varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix*modelViewMatrix*vec4(position,1.0); }',
      fragmentShader: `varying vec3 vP;
        void main(){
          float h = vP.y;
          vec3 top = vec3(0.76,0.70,0.97);
          vec3 mid = vec3(0.98,0.72,0.80);
          vec3 hor = vec3(1.00,0.86,0.72);
          vec3 c = mix(hor, mid, smoothstep(-0.02, 0.18, h));
          c = mix(c, top, smoothstep(0.18, 0.55, h));
          float sun = pow(max(dot(normalize(vP), normalize(vec3(-0.35,0.08,-1.0))),0.0), 40.0);
          c += vec3(1.0,0.9,0.8)*sun*0.6;
          gl_FragColor = vec4(c,1.0);
        }`,
    }),
  )
  g.add(sky)

  // Rolling pink dunes.
  const geo = new THREE.PlaneGeometry(80, 40, 220, 110)
  geo.rotateX(-Math.PI / 2)
  const pos = geo.attributes.position
  const colors: number[] = []
  const a = new THREE.Color(0xf7a8c4)
  const b = new THREE.Color(0xc4a8f2)
  const c = new THREE.Color()
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i)
    const z = pos.getZ(i)
    const y = Math.sin(x * 0.18 + z * 0.08) * 0.9 + Math.sin(x * 0.05 - z * 0.21) * 1.2 + Math.sin(x * 1.7 + z * 2.3) * 0.04
    pos.setY(i, y - 2.2 + Math.max(0, -z - 6) * 0.12)
    c.copy(a).lerp(b, Math.min(1, Math.max(0, (y + 1.5) / 3)))
    colors.push(c.r, c.g, c.b)
  }
  geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))
  geo.computeVertexNormals()
  const dunes = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.85 }))
  dunes.position.z = -8
  g.add(dunes)

  const bubbles: THREE.Mesh[] = []
  const bubbleMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, roughness: 0, transmission: 1, thickness: 0.6, ior: 1.25, iridescence: 1, iridescenceIOR: 1.3, clearcoat: 1,
  })
  for (const [x, y, z, r] of [[-4.2, 0.9, -2, 0.9], [3.9, -1.2, -1, 0.55], [-2.2, -1.5, 1, 0.35], [5.6, 1.9, -6, 0.8], [-6.5, 2.4, -7, 0.6]]) {
    const m = new THREE.Mesh(new THREE.SphereGeometry(r, 48, 32), bubbleMat)
    m.position.set(x, y, z)
    m.userData.base = y
    g.add(m)
    bubbles.push(m)
  }
  return { group: g, bubbles }
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

export default function Scene3D() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current!
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.setClearColor(0x000000, 0)

    const scene = new THREE.Scene()
    const pm = new THREE.PMREMGenerator(renderer)
    scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture
    const key = new THREE.DirectionalLight(0xfff0e6, 2.2)
    key.position.set(4, 7, 6)
    scene.add(key)
    const rim = new THREE.DirectionalLight(0xc9a3ff, 1.6)
    rim.position.set(-6, 2, -4)
    scene.add(rim)

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 200)
    const hero = buildHero()
    scene.add(hero.group)
    const { group: house, glow } = buildHouse()
    scene.add(house)

    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    window.addEventListener('resize', resize)

    // Where the house sits for each section, in view units: x/y from -1..1, s = scale.
    const POSES: Record<string, { x: number; y: number; s: number; glow: number }> = {
      hero: { x: 0.42, y: 0.02, s: 1.15, glow: 0.9 },
      intro: { x: 0.62, y: 0.42, s: 0.55, glow: 0.9 },
      process: { x: 0.5, y: 0.05, s: 1.0, glow: 3.2 },
      cta: { x: 0.0, y: 0.5, s: 0.72, glow: 1.4 },
      hidden: { x: 0, y: 0, s: 0, glow: 0.9 },
    }
    const cur = { x: 0.42, y: 0.02, s: 1.15, glow: 0.9 }
    let spin = 0
    let raf = 0
    const clock = new THREE.Clock()

    const tick = () => {
      const t = clock.getElapsedTime()
      const vh = window.innerHeight
      const heroEl = document.getElementById('hero')
      const heroP = heroEl ? clamp01(-heroEl.getBoundingClientRect().top / Math.max(1, heroEl.offsetHeight - vh)) : 1
      const inHero = heroEl ? heroEl.getBoundingClientRect().bottom > vh * 0.15 : false

      let target = POSES.hidden
      let active = 'hidden'
      if (inHero && heroP < 0.98) {
        target = POSES.hero
        active = 'hero'
      } else {
        for (const id of ['intro', 'process', 'cta']) {
          const el = document.getElementById(id === 'process' ? 'process-head' : id)
          if (!el) continue
          const r = el.getBoundingClientRect()
          if (r.top < vh * 0.6 && r.bottom > vh * 0.4) {
            target = POSES[id]
            active = id
          }
        }
      }

      // On phones the intro is taken by the portrait, so the house steps aside there.
      if (active === 'intro' && camera.aspect < 0.9) {
        target = POSES.hidden
        active = 'hidden'
      }
      const k = reduce ? 1 : 0.06
      // Leaving a section, the house shrinks away in place instead of sliding across the content.
      if (active !== 'hidden') {
        cur.x += (target.x - cur.x) * k
        cur.y += (target.y - cur.y) * k
      }
      cur.s += (target.s - cur.s) * (active === 'hidden' && !reduce ? 0.14 : k)
      cur.glow += (target.glow - cur.glow) * k

      // Hero camera dollies in as you scroll, like pushing into the scene.
      const camZ = 10 - heroP * 3.2
      camera.position.set(0, 0.6 - heroP * 0.4, camZ)
      camera.lookAt(0, 0.1, 0)
      hero.group.visible = active === 'hero' || heroP < 1
      hero.bubbles.forEach((b, i) => {
        b.position.y = b.userData.base + (reduce ? 0 : Math.sin(t * 0.6 + i * 1.7) * 0.25)
      })

      // Convert the pose to world space at the house's depth.
      const dist = camera.position.z
      const halfH = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * dist
      const narrow = camera.aspect < 0.9
      const px = (narrow ? cur.x * 0.15 : cur.x) * halfH * camera.aspect
      const py = (narrow && active === 'hero' ? 0.32 : cur.y) * halfH + (reduce ? 0 : Math.sin(t * 1.1) * 0.12)
      house.position.set(px, py + camera.position.y - 0.6, 0)
      const scrollSpin = window.scrollY * 0.0026
      spin += ((reduce ? 0 : t * 0.25) + scrollSpin - spin) * 0.1
      house.rotation.set(0.18 + (reduce ? 0 : Math.sin(t * 0.8) * 0.05), -0.6 + spin, reduce ? 0 : Math.sin(t * 0.7) * 0.04)
      const sc = cur.s * (narrow ? 0.75 : 1) * (dist / 10)
      house.scale.setScalar(sc)
      glow.emissiveIntensity = cur.glow
      house.visible = cur.s > 0.02

      if (hero.group.visible || house.visible) renderer.render(scene, camera)
      else renderer.clear()
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      renderer.dispose()
    }
  }, [])

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 z-20 h-screen w-screen" />
}
