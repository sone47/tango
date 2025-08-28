import { isNumber } from 'lodash'
import { useNavigate, useParams } from 'react-router'

import Page from '@/components/Page'

import CardpackList from './components/CardpackList'

export default function WordPackEditPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  if (!isNumber(+id!)) {
    navigate('/wordpack', { replace: true })
    return
  }

  return (
    <Page title="编辑词包">
      <CardpackList wordPackId={+id!} />
    </Page>
  )
}
