export async function fetchUsers(duration: number) {
    const res = await fetch(`/users?duration=${duration}`)
    if (!res.ok) throw new Error('Network response was not ok')
    return await res.json()
  }