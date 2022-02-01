export function sanitizeDocId(id: string) {
  return id.replace(/[^a-zA-Z]/g, "_");
}
