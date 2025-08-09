import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'conversations'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('message_id').nullable().references('id').inTable('messages').onDelete('set null')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['message_id'])
      table.dropColumn('message_id')
    })
  }
}
