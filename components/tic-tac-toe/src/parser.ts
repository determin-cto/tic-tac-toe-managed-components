
import { IncomingMessage } from 'http';

export async function parseJsonBody<T>(request: IncomingMessage): Promise<T> {
  let body = ''
  return new Promise((resolve, reject) => {
    request.on('data', chunk => body += chunk)
    request.on('end', () => {
      try {
        resolve(JSON.parse(body) as T)
      } catch (e) {
        reject(e)
      }
    })
  })
}
