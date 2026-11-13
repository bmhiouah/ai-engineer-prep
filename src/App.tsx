import { Cover } from './cover/Cover'
import { useProgressStore } from './progress/store'
import { StudyRoom } from './skill/StudyRoom'

export default function App() {
  const selectedSkillId = useProgressStore((s) => s.selectedSkillId)

  // Cover = constellation. Selected skill = plunge into the book (full screen).
  if (selectedSkillId) return <StudyRoom />
  return <Cover />
}
