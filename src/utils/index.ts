export class Utils {
  public static delUndef<T extends object> (obj: T): Partial<T> {
    for (const key of Object.keys(obj)) {
      if (obj[key] === undefined) {
        delete obj[key]
      }
    }

    return obj
  }
}
