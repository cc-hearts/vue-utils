import { describe, test, expect, vi } from "vitest";
import { useReactiveToPromisify } from "../composables/use-reactive-to-promisify";
import { ref, nextTick } from "vue";


describe('reactive to promisify', () => {

  test('convert the value of reactive to a promise', async () => {
    const mockFn = () => {
      const target = ref(false)
      setTimeout(() => {
        target.value = true
      }, 2000)
      return target
    }
    vi.useFakeTimers()
    const promisifyFn = useReactiveToPromisify(mockFn, (resolve, _, ret) => {
      if (ret.value) {
        resolve(ret.value)
      }
    })

    const ret = promisifyFn()

    vi.runAllTimers()

    expect(ret).resolves.toBe(true)
  })

  test('Cache hook conversion', () => {
    const target = ref(false)
    const spyFn = vi.fn()

    const mockFn = () => {
      if (!target.value) {
        setTimeout(() => {
          spyFn()
          target.value = true
        }, 2000)
      }
      return target
    }

    vi.useFakeTimers()
    const promisifyFn = useReactiveToPromisify(mockFn, (resolve, _, ret) => {
      if (ret.value) {
        resolve(ret.value)
      }
    })

    const mockThenFn = vi.fn()
    promisifyFn().then(mockThenFn)
    vi.runAllTimers()
    nextTick(() => {
      expect(mockThenFn).toHaveBeenCalled()
    })

    const fns = []
    for (let i = 0; i < 3; i++) {
      const target = promisifyFn()
      fns.push(target)
      expect(target).resolves.toBe(true)
    }

    Promise.all(fns).then(() => {
      expect(spyFn).toHaveBeenCalledTimes(3)
    }).catch(() => {/** */})
  })

  test('custom watcher callback', () => {
    // TODO:
  })
})