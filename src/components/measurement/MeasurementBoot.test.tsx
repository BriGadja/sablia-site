import { render } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MeasurementBoot } from './MeasurementBoot'

const order: string[] = []
vi.mock('@/lib/analytics', () => ({
  applyStatsParam: vi.fn(() => {
    order.push('stats')
  }),
  initAnalytics: vi.fn(() => {
    order.push('init')
  }),
}))
vi.mock('@/lib/events', () => ({
  startEventTracking: vi.fn(() => () => {}),
}))

beforeEach(() => {
  order.length = 0
})

describe('MeasurementBoot', () => {
  it('applies ?stats=off|on BEFORE it starts the tracker and the recorder', () => {
    render(<MeasurementBoot />)
    expect(order).toEqual(['stats', 'init'])
  })
})
