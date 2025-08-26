import { Star } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import Modal from '@/components/Modal'
import ProficiencySlider from '@/components/ProficiencySlider'
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { practiceService } from '@/services/practiceService'
import { usePracticeStore } from '@/stores/practiceStore'

const HistoryPool = () => {
  const { studiedWords, showHistoryPool, updateState } = usePracticeStore()

  const [api, setApi] = useState<CarouselApi>()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [practiceData, setPracticeData] = useState<Record<number, number>>({})

  const handleOpen = useCallback(async () => {
    if (!showHistoryPool || !studiedWords.length) return

    setCurrentIndex(0)
    api?.scrollTo(0)

    const wordIds = studiedWords.map((word) => word.id)
    const practices = await practiceService.getPracticesByVocabularyIds(wordIds)
    const data = Object.fromEntries(
      practices.map((practice) => [practice.vocabularyId, practice.proficiency])
    )
    setPracticeData(data)
  }, [showHistoryPool, studiedWords, api])

  useEffect(() => {
    handleOpen()
  }, [handleOpen])

  useEffect(() => {
    if (!api) return

    api.on('select', () => {
      setCurrentIndex(api.selectedScrollSnap())
    })
  }, [api])

  const updateProficiency = (proficiency: number) => {
    setPracticeData((prev) => ({
      ...prev,
      [currentWord?.id]: proficiency,
    }))
  }

  const handleProficiencyChangeComplete = async (proficiency: number) => {
    await practiceService.updatePractice(currentWord?.id, { proficiency })
  }

  const handleModalClose = () => {
    updateState({
      showHistoryPool: false,
    })
  }

  const currentWord = studiedWords[currentIndex]

  return (
    <Modal isOpen={showHistoryPool} onClose={handleModalClose} title="历史卡池" maxWidth="md">
      {studiedWords.length > 0 ? (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                {currentIndex + 1} / {studiedWords.length}
              </span>
            </div>
          </div>

          <Carousel className="w-full" setApi={setApi} opts={{ loop: true }}>
            <CarouselContent>
              {studiedWords.map((word) => (
                <CarouselItem key={word.id}>
                  <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 flex flex-col justify-between gap-4">
                    <div className="flex flex-col items-center gap-3">
                      <span className="text-xl font-medium text-gray-800">{word.phonetic}</span>
                      <span className="text-3xl font-bold text-gray-900">{word.word}</span>
                      <span className="text-lg text-gray-700">{word.definition}</span>
                    </div>

                    <div className="bg-white/80 p-4 rounded-xl">
                      <p className="text-sm text-gray-600 mb-2 font-medium">例句:</p>
                      {word.example ? (
                        <p className="text-gray-800 leading-relaxed">{word.example}</p>
                      ) : (
                        <div className="text-center py-2">
                          <p className="text-gray-500">暂无例句</p>
                          <p className="text-gray-400 text-sm mt-1">该词汇还没有添加例句</p>
                        </div>
                      )}
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* 熟练度调整 */}
          {currentWord && (
            <div className="bg-gray-50 rounded-2xl p-4">
              <ProficiencySlider
                value={practiceData[currentWord.id] ?? 0}
                onChange={updateProficiency}
                onChangeComplete={handleProficiencyChangeComplete}
                size="lg"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full mb-4 mx-auto flex items-center justify-center">
            <Star size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">暂无历史学习记录</h3>
          <p className="text-gray-600">快去学习吧～</p>
        </div>
      )}
    </Modal>
  )
}

export default HistoryPool
