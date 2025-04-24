import mongoose from 'mongoose'
import Record from './recordModel.ts'

const handlers = {
  save: async (record) => {
    const newRecord = new Record(record)
    const savedRecord = await newRecord.save()
    return { status: 'OK', id: savedRecord._id }
  },

  update: async (record) => {
    await Record.findByIdAndUpdate(record.id, record)
    return { status: 'OK' }
  },

  // list: async () => {
  //   return await Record.find({ 'bookScope.book': '外科学' }).exec()
  // },
}

export default defineEventHandler(async (event) => {
  try {
    const { record, method } = await readBody(event)
    let uri = process.env.RECORD_DATABASE_URL
    if (!uri) {
      throw new Error('Database URI is not defined in environment variables.')
    }
    // Fix Edgeone RECORD_DATABASE_URL
    if (!uri.startsWith('mongodb+srv://')) {
      uri = 'mongodb+srv://' + uri
    }

    await mongoose.connect(uri)

    const handler = handlers[method]
    if (!handler) {
      throw new Error('Invalid method specified.')
    }

    const result = await handler(record)
    return result
  } catch (error) {
    console.error('Error in event handler:', error)
    return { error: error.message }
  } finally {
    await mongoose.connection.close()
  }
})
