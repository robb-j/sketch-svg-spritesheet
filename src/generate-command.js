// documentation: https://developer.sketchapp.com/reference/api/
import sketch from 'sketch'

import dialog from '@skpm/dialog'
import fs from '@skpm/fs'

const svgTag = () => /<svg.*?viewBox="(.*?)".*?>([\s\S]*)<\/svg>/gm
const titleTag = () => /<title>(.*?)<\/title>/g
const idAttr = () => /\s*id="(.*?)"\s*/g
const fillBlackAttr = () => /fill="(#000000)"/g
const strokeBlackAttr = () => /stroke="(#000000)"/g

// Convert human words into a `lower-cased-slug`
function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/-+/g, '-')
}

export default async function() {
  const doc = sketch.getSelectedDocument()
  
  if (doc.selectedLayers.length === 0) {
    sketch.UI.message('No layers are selected.')
    return
  }
  
  // Ask the user where to put the generated file
  const saveLocation = await dialog.showSaveDialog({
    title: 'icons.svg',
    message: 'Where to save the generated icons',
    defaultPath: 'icons.svg',
    filters: [
      { name: 'Images', extensions: ['svg'] },
    ],
    showsTagField: false
  })
  if (saveLocation.canceled) return
  
  // Start building the new SVG
  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">'
  ]
  
  // Go through each selected layer and export them as an SVG
  for (const layer of doc.selectedLayers.layers) {
    const data = sketch.export(layer, {
      formats: 'svg',
      output: false
    })
    
    // Grab the SVG contents using our regex
    const svgMatch = svgTag().exec(data)
    if (!svgMatch) {
      console.error('no svg found')
      console.error(data)
      continue
    }
    
    // Get the viewBox attribute and sanitise the SVG body
    // - take out the <title> tag
    // - remove any id="xxx" attributes
    // - replace any black fills with `currentColor`
    // - replace any black strokes with `currentColor`
    const viewBox = svgMatch[1]
    const inner = svgMatch[2]
      .replace(titleTag(), '')
      .replace(idAttr(), ' ')
      .replace(fillBlackAttr(), 'fill="currentColor"')
      .replace(strokeBlackAttr(), 'stroke="currentColor"')
    
    // Decide the id for the new <symbol>
    // - slugify the title or its existing name
    const titleMatch = titleTag().exec(data)
    const id = slugify(titleMatch?.[1] ?? layer.name)
    
    console.debug({ id, viewBox, inner })
    
    // Construct an SVG <symbol> from our parsed data
    lines.push(
      `<symbol id="${id}" viewBox="${viewBox}">`,
      inner,
      '</symbol>'
    )
  }
  
  // End the SVG and write it to the user specified file
  lines.push('</svg>')
  fs.writeFileSync(
    saveLocation.filePath,
    lines.join('\n').replace(/^\s+/gm, '')
  )
}
