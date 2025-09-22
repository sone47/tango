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

  async addExample(
    example: Omit<ExampleEntity, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ExampleEntity> {
    const newExample = {
      ...example,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    const savedExample = await this.exampleRepo.save(newExample)
    return savedExample
  }

  async updateExample(example: ExampleEntity): Promise<ExampleEntity> {
    const updatedExample = {
      ...example,
      updatedAt: new Date().toISOString(),
    }
    const savedExample = await this.exampleRepo.save(updatedExample)
    return savedExample
  }

  async deleteExample(exampleId: number): Promise<void> {
    await this.exampleRepo.delete(exampleId)
  }
}

export const exampleService = new ExampleService()
