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
    const mockFn = () => {
      if (!target.value) {
        setTimeout(() => {
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

    for (let i = 0; i < 3; i++) {
      expect(promisifyFn()).resolves.toBe(true)
    }
  })
})