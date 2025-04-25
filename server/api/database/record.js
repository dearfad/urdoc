// import { MongoClient, ObjectId } from 'mongodb'

export default defineEventHandler(async () => {
  return { status: 'FAILED', content: 'No server' }
  // const { record, method } = await readBody(event)
  // let uri = process.env.MONGODB_URI
  // // Fix Edgeone RECORD_DATABASE_URL
  // if (!uri.startsWith('mongodb+srv://')) {
  //   uri = 'mongodb+srv://' + uri
  // }
  // const client = new MongoClient(uri)
  // try {
  //   const database = client.db('urdoc')
  //   const records = database.collection('records')

  //   const handlers = {
  //     insert: async (record) => {
  //       record._id = new ObjectId()
  //       const result = await records.insertOne(record)
  //       return { status: 'OK', id: result.insertedId }
  //     },

  //     update: async (record) => {
  //       const { _id, ...rest } = record
  //       if (typeof _id !== 'string') {
  //         throw new Error('Invalid _id type. Expected a string.')
  //       }
  //       const result = await records.updateOne({ _id: new ObjectId(_id) }, { $set: rest })
  //       console.log('update result', result.modifiedCount)
  //       return { status: 'OK', count: result.modifiedCount }
  //     },
  //   }

  //   const handler = handlers[method]
  //   const result = await handler(record)
  //   return result
  // } catch (error) {
  //   console.error('Error in event handler:', error)
  //   return { status: 'FAILED', error: error.message }
  // } finally {
  //   await client.close()
  // }
})
