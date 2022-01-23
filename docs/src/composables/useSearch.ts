export type SearchIndex = 'repo' | 'api' | 'prose'

const searchOn = async(idx: SearchIndex, text: string) => {
  const url = `http://localhost:7700/indexes/${idx}/search?q=${text}`
  const check = await fetch(url)
  if (check.ok)
    return check.json()
  else
    throw new Error(`Problem calling endpoint [${check.status}]: ${url}. Message was "${check.statusText}"`)
}

function isRepoDoc


export function useSearch(defaultIndexes: SearchIndex[] = ['repo', 'api']) {
  return {
    search(text: string, included: SearchIndex[] = defaultIndexes) {
      const wait: Promise<any>[] = []
      for (const i of included) {
        wait.push(searchOn(i, text).then((r) => {
          switch(i) {
            case "api":
              
          }

        }))
      }
      Promise.all(wait)
    },
  }
}
