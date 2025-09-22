import { Star } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import Modal from '@/components/Modal'
import ProficiencySlider from '@/components/ProficiencySlider'
import CardPreview from '@/components/tango/CardPreview'
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { useCurrentWordPack } from '@/hooks/useCurrentWordPack'
import { practiceService } from '@/services/practiceService'
import { usePracticeStore } from '@/stores/practiceStore'

const HistoryPool = () => {
  const { currentWordPack } = useCurrentWordPack()
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
                  <CardPreview language={currentWordPack!.language} word={word} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* 熟练度调整 */}
          {currentWord && (
            <div className="rounded-2xl bg-gray-50">
              <ProficiencySlider
                className="p-4"
                value={practiceData[currentWord.id] ?? 0}
                onChange={updateProficiency}
                onChangeComplete={handleProficiencyChangeComplete}
                size="lg"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="py-12 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <Star size={24} className="text-gray-400" />
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-800">暂无历史学习记录</h3>
          <p className="text-gray-600">快去学习吧～</p>
        </div>
      )}
    </Modal>
  )
}

export default HistoryPool
