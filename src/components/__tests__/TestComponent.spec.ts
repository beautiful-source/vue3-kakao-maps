import { describe, it, expect } from 'vitest'

import { mount } from '@vue/test-utils'
import TestComponent from '../TestComponent.vue'

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(TestComponent, { props: { content: 'Vitest' } })
    expect(wrapper.text()).toContain('Hello Vitest')
  })
})
