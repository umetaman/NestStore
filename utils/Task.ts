export const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export const forget = (func: () => void) => {
  func()
}

export async function run<T> (func: () => Promise<T>): Promise<T> {
  return await func()
}

export async function waitUntil (predictor: () => boolean): Promise<void> {
  while (true) {
    await delay(1)
    if (predictor()) {
      break
    }
  }
}
