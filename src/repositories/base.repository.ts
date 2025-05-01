export abstract class BaseRepository<T> {
  constructor(protected readonly model: any) {}

  async findAll(): Promise<T[]> {
    return this.model.findMany();
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({
      where: { id },
    });
  }

  async create(data: any): Promise<T> {
    return this.model.create({
      data,
    });
  }

  async update(id: number, data: any): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    });
  }

  async delete(id: number): Promise<T> {
    return this.model.delete({
      where: { id },
    });
  }
}
