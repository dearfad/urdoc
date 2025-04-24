// import mongoose from 'mongoose'
// const recordSchema = new mongoose.Schema({
//   id: String,
//   case: {
//     姓名: String,
//     性别: String,
//     年龄: String,
//     主诉: String,
//     现病史: String,
//     既往史: String,
//     查体: String,
//     专科查体: String,
//     辅助检查: String,
//     诊断: String,
//     治疗: String,
//     手术: String,
//     病理: String,
//   },
//   story: {
//     故事: String,
//   },
//   test: [
//     {
//       问题: String,
//       选项: {
//         type: Map,
//         of: String,
//       },
//       答案: String,
//     },
//   ],
//   act: [
//     {
//       role: {
//         type: String,
//         enum: ['system', 'user', 'assistant'],
//       },
//       content: String,
//     },
//   ],
//   rate: [
//     {
//       role: {
//         type: String,
//         enum: ['system', 'user', 'assistant'],
//       },
//       content: String,
//     },
//   ],
//   face: String,
//   voice: String,
//   pose: String,
//   bookScope: {
//     book: String,
//     chapter: String,
//     section: String,
//     subsection: String,
//   },
//   customConfig: {
//     case: String,
//     story: String,
//     test: String,
//     act: String,
//     rate: String,
//     face: String,
//   },
// })
// const Record = mongoose.model('Record', recordSchema)
// export default Record
