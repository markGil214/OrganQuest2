import { render, screen } from '@testing-library/react';
import { Card } from './Card';

describe('Card Component', () => {
  it('should render card with children', () => {
    render(
      <Card>
        <p>Card content</p>
      </Card>
    );
    expect(screen.getByText('Card content')).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    const { container } = render(
      <Card>
        <p>Test</p>
      </Card>
    );
    const card = container.firstChild;
    expect(card).toHaveClass('bg-card');
  });

  it('should apply custom className', () => {
    const { container } = render(
      <Card className="custom-class">
        <p>Test</p>
      </Card>
    );
    const card = container.firstChild;
    expect(card).toHaveClass('custom-class');
  });
});
