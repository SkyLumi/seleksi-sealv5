import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'

export default class ApiKeyAuth {
  public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {
    const apiKey = request.header('X-API-KEY')
    const serverKey = Env.get('API_SECRET_KEY')
    if (!apiKey || apiKey !== serverKey) {
      return response.unauthorized({ error: 'invalid or missing API key' })
    }
    await next()
  }
}
