import mongoose from 'mongoose'
export default defineEventHandler(async () => {
  const uri =
    'mongodb+srv://anonymous:anonymous@azurehk.vppsagb.mongodb.net/urdoc?retryWrites=true&w=majority&appName=AzureHK'

  const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } }

  await mongoose.connect(uri, clientOptions)
  const Cat = mongoose.model('Cat', { name: String })
  const kitty = new Cat({ name: 'Zildjian' })
  kitty.save().then(() => console.log('meow'))
})
