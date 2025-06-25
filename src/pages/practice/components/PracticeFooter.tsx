interface PracticeFooterProps {
  currentWordIndex: number
  totalWords: number
}

const PracticeFooter = ({ currentWordIndex, totalWords }: PracticeFooterProps) => {
  return (
    <div className="p-2 bg-white/70 backdrop-blur-sm">
      <div className="flex items-center justify-center">
        <span className="text-sm text-gray-600">
          {currentWordIndex + 1} / {totalWords}
        </span>
      </div>
    </div>
  )
}

export default PracticeFooter
