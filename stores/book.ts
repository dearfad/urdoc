import surgery from '@/assets/books/surgery.js'
import internalMedicine from '@/assets/books/internalMedcine.js'
import pediatrics from '@/assets/books/pediatrics.js'
import obstetricsAndGynecology from '@/assets/books/obstetricsAndGynecology.js'
import neurology from '@/assets/books/neurology.js'

export const useBookStore = defineStore('book', () => {
  const books = ref({
    外科学: surgery,
    内科学: internalMedicine,
    妇产科学: obstetricsAndGynecology,
    儿科学: pediatrics,
    神经病学: neurology,
  })
  return { books }
})
