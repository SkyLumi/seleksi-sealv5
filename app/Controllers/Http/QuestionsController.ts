// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContext } from "@adonisjs/core/build/standalone"
import { ValidationException } from "@ioc:Adonis/Core/Validator"
import Conversation from "App/Models/Conversation"
import Message from "App/Models/Message"
import ChatValidator from "App/Validators/ChatValidator"
import axios from "axios"
import { v4 as uuid } from 'uuid';

export default class QuestionsController {
  tryParseJSON = (str: string) => {
    try {
      return JSON.parse(str)
    } catch {
      return str
    }
  }

  public async index(ctx: HttpContext) {
    const page = Number(ctx.request.input('page', 1))
    const limit = Number(ctx.request.input('limit', 10))

    const conversations = await Conversation
      .query()
      .preload("messages")
      .paginate(page, limit)

    const paginated = conversations.toJSON()

    const formattedData = paginated.data.map((conversation) => {
      return {
        id: conversation.id,
        sessionId: conversation.sessionId,
        last_messages: this.tryParseJSON(conversation.last_messages),
        messages: conversation.messages.map((message: any) => ({
          id: message.id,
          senderType: message.senderType,
          message: this.tryParseJSON(message.message),
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
          conversationId: message.conversationId
        })),
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt
      }
    })

    return ctx.response.ok({
      status: 200,
      message: "success",
      meta: {
        ...paginated.meta,
      },
      data: formattedData
    })
  }


  public async show(ctx: HttpContext) {
    const { id } = ctx.request.params()


    if (!parseInt(id)) {
      return ctx.response.badRequest({
        status: 400,
        message: "Validation failure",
        error: "invalid id",
      })
    }
    const conversationData = await Conversation.query().where('id', id).preload("messages").first()

    if (!conversationData) {
      return ctx.response.notFound({
        status: 404,
        message: "not found",
        error: "data not found"
      })
    }

    return ctx.response.ok({
      status: 200,
      message: "success",
      data: {
        id: conversationData.id,
        sessionId: conversationData.sessionId,
        lastMessages: this.tryParseJSON(conversationData.lastMessage),
        messages: conversationData.messages.map((msg) => ({
          id: msg.id,
          senderType: msg.senderType,
          message: this.tryParseJSON(msg.message),
          createdAt: msg.createdAt,
          updatedAt: msg.updatedAt,
          conversationId: msg.conversationId
        }))
      }
    })
  }

  public async store(ctx: HttpContext) {
    console.log("ISI BODY REQUEST YANG DITERIMA SERVER:", ctx.request.body())
    const bodyRequest = ctx.request.body()
    try {
      await ctx.request.validate(ChatValidator)
    } catch (error) {
      if (error instanceof ValidationException) {
        return ctx.response.badRequest({
          status: 400,
          message: 'Validation failure',
          errors: (error as any).messages.errors
        })
      }

    }
    if (bodyRequest.sessionId && !(await Conversation.query().where("sessionId", bodyRequest.sessionId).first())) {
      return ctx.response.badRequest({
        status: 404,
        message: "not found",
        error: "conversation with your sessionId is not found"
      })
    }

    const sessionId = bodyRequest.sessionId ?? uuid()

    const ress = await axios.post("https://api.majadigi.jatimprov.go.id/api/external/chatbot/send-message", {
      question: bodyRequest.message,
      sessionId
    })

    const conversationData = await Conversation.updateOrCreate({
      sessionId: sessionId
    }, {
      lastMessage: JSON.stringify(ress.data.data.message[0])
    })

    Message.createMany([
      {
        conversationId: conversationData.id,
        message: bodyRequest.message,
        senderType: "user"
      },
      {
        conversationId: conversationData.id,
        message: JSON.stringify(ress.data.data.message[0]),
        senderType: "bot"
      }
    ])

    return ctx.response.ok({
      status: 200,
      message: "success",
      sessionId,
      data: ress.data.data.message
    })
  }

  public async destroy(ctx: HttpContext) {

    const { id } = ctx.request.params()

    if (!parseInt(id)) {
      return ctx.response.badRequest({
        status: 400,
        message: "Validation failure",
        error: [
          {
            message: "invalid id",
          }
        ]
      })
    }

    const conversationData = await Conversation.find(id)

    if (!conversationData) {
      return ctx.response.notFound({
        status: 404,
        message: "not found",
        error: "data not found"
      })
    }

    await conversationData.delete()

    return ctx.response.ok({
      status: 200,
      message: "success",
      data: {
        id: conversationData.id,
        sessionId: conversationData.sessionId,
        last_messages: this.tryParseJSON(conversationData.lastMessage),
        createdAt: conversationData.createdAt,
        updatedAt: conversationData.updatedAt
      }
    })
  }

  public async destroyMessage(ctx: HttpContext) {
    const { id } = ctx.request.params()

    if (!parseInt(id)) {
      return ctx.response.badRequest({
        status: 400,
        message: "Validation failure",
        error: "invalid id",
      })
    }

    const messageData = await Message.find(id)

    if (!messageData) {
      return ctx.response.notFound({
        status: 404,
        message: "not found",
        error: "data not found"
      })
    }

    await messageData.delete()

    return ctx.response.ok({
      status: 200,
      message: "success",
      data: { ...messageData.toJSON(), message: this.tryParseJSON(messageData.message) }
    })
  }
}