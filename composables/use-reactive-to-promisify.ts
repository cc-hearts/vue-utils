import type { Fn } from '@cc-heart/utils/helper'
import { effectScope, watch } from 'vue'

export function useReactiveToPromisify<
  T extends (...args: any) => any,
  S = ReturnType<T> & { onWatcherCallback?: Fn },
  P = any
>(hookFn: T, callback: (resolve: Fn, reject: Fn, ret: S) => void) {
  const scope = effectScope()

  return () => {
      const ret = new Promise<P>((resolve, reject) => {
        scope.run(() => {
          const ret = hookFn()
          const watcher = ret?.onWatcherCallback || ret

          watch(
            watcher,
            () => {
              callback(resolve, reject, ret)
            },
            { immediate: true },
          )
        })
      })

      ret.finally(() => {
        scope.stop()
      }).catch(() => {
        //
      })

    return ret
  }
}