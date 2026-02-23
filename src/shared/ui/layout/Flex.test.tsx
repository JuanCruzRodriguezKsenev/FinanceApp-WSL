import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Flex } from './Flex';

describe('Flex Component', () => {
  it('renders children correctly', () => {
    const { getByText } = render(
      <Flex>
        <span>Test Child</span>
      </Flex>
    );
    expect(getByText('Test Child')).toBeInTheDocument();
  });

  it('applies default classes', () => {
    const { container } = render(<Flex>Child</Flex>);
    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain('flex');
    expect(div.className).toContain('row');
  });

  it('applies column direction class', () => {
    const { container } = render(<Flex direction="column">Child</Flex>);
    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain('column');
  });

  it('applies gap classes', () => {
    const { container } = render(<Flex gap={4}>Child</Flex>);
    const div = container.firstChild as HTMLElement;
    expect(div.className).toContain('gap4');
  });
});
