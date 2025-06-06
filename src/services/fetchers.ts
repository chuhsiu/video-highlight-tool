export async function fetchSections(duration: number) {
    const res = await fetch(`/getSections?duration=${duration}`)
    if (!res.ok) throw new Error('Network response was not ok')
    return await res.json()
  }