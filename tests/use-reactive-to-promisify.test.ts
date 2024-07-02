import { describe, test, expect, vi } from "vitest";
import { useReactiveToPromisify } from "../composables/use-reactive-to-promisify";
import { ref } from "vue";


describe('reactive to promisify', () => {

  test('convert the value of reactive to a promise', async () => {
    const mockFn = () => {
      const target = ref(false)
      setTimeout(() => {
        target.value = true
      }, 2000)
      return target
    }

    const promisifyFn = useReactiveToPromisify(mockFn, (resolve,_, ret) => {
      if (ret.value) {
        resolve(ret.value)
      }
    })

    const ret = promisifyFn()

    vi.runAllTimers()

    expect(ret).resolves.toBe(true)
  })
})