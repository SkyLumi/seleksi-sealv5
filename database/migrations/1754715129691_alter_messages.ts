import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'messages'

  public async up () {
    this.schema.alterTable(this.tableName, (table) => {
      table.integer('conversation_id').nullable().references('id').inTable('conversations').onDelete('cascade')
    })
  }

  public async down () {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropForeign(['conversation_id'])
      table.dropColumn('conversation_id')
    })
  }
}
