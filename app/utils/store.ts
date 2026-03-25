/**
 * 同步并校验 Store 的版本号。
 * 仅在客户端环境下执行。如果本地存储中存在指定名称的数据，
 * 但其中的版本号与传入的版本号不一致，则清除该本地存储数据，
 * 以防止因版本不兼容导致的状态错误。
 *
 * @param version - 当前应用的期望版本号
 * @param name - 本地存储中数据的键名 (key)
 */

export function syncStoreVersion(version: string, name: string) {
  if (import.meta.client) {
    const store = localStorage.getItem(name)
    if (store) {
      const data = JSON.parse(store)
      if (data.version !== version) {
        localStorage.removeItem(name)
      }
    }
  }
}
