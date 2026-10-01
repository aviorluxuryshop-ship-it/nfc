/**
 * Marks <html data-gl="hw|sw">: whether WebGL runs on a GPU. In software
 * rendering (no usable GPU: blocklisted drivers, virtual machines, headless
 * test runners) every frame of the hero ring would tie up the main thread, so
 * those visitors get the CSS film strip instead. Browsers flag some of these
 * cases themselves; the renderer name catches the rest.
 *
 * Self-contained on purpose: the hero also inlines it (via toString) to run
 * right after first paint, so the strip can show before the page hydrates.
 */
export function probeGL(): boolean {
  const root = document.documentElement
  if (root.dataset.gl) return root.dataset.gl === 'hw'
  let hw = false
  try {
    const canvas = document.createElement('canvas')
    const opts = { failIfMajorPerformanceCaveat: true }
    const gl = (canvas.getContext('webgl2', opts) || canvas.getContext('webgl', opts)) as WebGLRenderingContext | null
    if (gl) {
      const info = gl.getExtension('WEBGL_debug_renderer_info')
      const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : ''
      const lose = gl.getExtension('WEBGL_lose_context')
      if (lose) lose.loseContext()
      hw = !/swiftshader|llvmpipe|softpipe|software|basic render/i.test(renderer)
    }
  } catch {}
  root.dataset.gl = hw ? 'hw' : 'sw'
  return hw
}

/** Inline script: probe once the first frame is on screen, never before it. */
export const GL_PROBE_SCRIPT = `requestAnimationFrame(function(){setTimeout(${probeGL.toString()})})`
