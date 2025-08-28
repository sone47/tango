import { getGlobalIDBManager } from '@/hooks/useDatabase'
import { type ExampleEntity, exampleSchema } from '@/schemas'

export class ExampleService {
  private get exampleRepo() {
    return getGlobalIDBManager().getRepository<ExampleEntity>(exampleSchema)
  }

  async getExampleById(exampleId: number): Promise<ExampleEntity | null> {
    const example = await this.exampleRepo.findById(exampleId)
    return example || null
  }

  async getExamplesByVocabularyId(vocabularyId: number): Promise<ExampleEntity[]> {
    const examples = await this.exampleRepo.findBy('vocabularyId', vocabularyId)
    return examples
  }
}

export const exampleService = new ExampleService()
