import { describe, test, expect, vi } from "vitest";
import { useReactiveToPromisify } from "../composables/use-reactive-to-promisify";
import { ref, nextTick } from "vue";


describe('reactive to promisify', () => {

  test('convert the value of reactive to a return promise function', async () => {
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

  test('function calls result in independent', () => {
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
    const target = ref(false)

    const mockFn = () => {
      const mockData = {
        foo: 'baz'
      }

      setTimeout(() => {
        target.value = true
      }, 2000)

      return { mockData, target, onWatcherCallback: () => target.value }
    }

    vi.useFakeTimers()
    const promisifyFn = useReactiveToPromisify(mockFn, (resolve, _, ret) => {
      if (ret.target.value) {
        resolve(ret.mockData)
      }
    })

    const ret = promisifyFn()
    vi.runAllTimers()
    expect(ret).resolves.toEqual({ foo: 'baz' })
  })


  // 如果callback抛出异常
  test('callback throws exception', () => {
    const target = ref(false)

    const mockFn = () => {
      const mockData = {
        foo: 'baz'
      }

      setTimeout(() => {
        target.value = true
      }, 2000)

      return { mockData, target, onWatcherCallback: () => target.value }
    }

    vi.useFakeTimers()
    const promisifyFn = useReactiveToPromisify(mockFn, (_, reject, ret) => {
      if (ret.target.value) {
        reject(ret.mockData)
      }
    })

    const ret = promisifyFn()
    vi.runAllTimers()
    expect(ret).rejects.toEqual({ foo: 'baz' })
  })
})