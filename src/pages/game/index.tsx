import HistoryPool from './components/HistoryPool'
import PracticeContent from './components/PracticeContent'
import PracticeHeader from './components/PracticeHeader'

export default function GamePage() {
  return (
    <>
      <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
        <PracticeHeader />
        <PracticeContent />
      </div>
      <HistoryPool />
    </>
  )
}
