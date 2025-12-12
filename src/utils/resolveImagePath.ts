const imageModules = import.meta.glob('../assets/images/*', {
  eager: true,
  import: 'default',
}) as Record<string, string>

const imageMap = new Map<string, string>()

Object.entries(imageModules).forEach(([relativePath, url]) => {
  const fileName = relativePath.split('/').pop()
  if (!fileName) return

  imageMap.set(fileName, url)
  imageMap.set(`/src/assets/images/${fileName}`, url)
})

export const resolveImagePath = (source: string) => {
  if (!source) return source
  if (/^(https?:)?\/\//.test(source) || source.startsWith('data:')) return source

  const fileName = source.split('/').pop()

  return imageMap.get(source) ?? (fileName ? imageMap.get(fileName) : undefined) ?? source
}
