export interface CRUD<T> {
    findMany(select?: object): Promise<T[]>;
    findById(id: any): Promise<T | null>;
    create(data: Partial<T>): Promise<T>;
    update(id: any, data: Partial<T>): Promise<T>;
}
