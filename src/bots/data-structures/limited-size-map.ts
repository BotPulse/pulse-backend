export class LimitedSizeMap {
  private maxSize = 1000;
  private map = new Map<string, any>();
  private order = []; // Array para mantener el orden de inserción
  constructor() {}

  public set(key: string, value: any) {
    // Verificar si el tamaño excede el límite
    if (this.map.size >= this.maxSize) {
      // Eliminar el elemento más antiguo
      const oldestKey = this.order.shift();
      this.map.delete(oldestKey);
    }

    // Agregar el nuevo elemento
    this.map.set(key, value);
    this.order.push(key);
  }

  public get(key: string) {
    return this.map.get(key);
  }
}
