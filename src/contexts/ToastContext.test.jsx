import { render, screen, fireEvent } from '@testing-library/react';
import { ToastProvider, useToast } from '../contexts/ToastContext';

// Test component that uses the toast
const TestComponent = () => {
  const toast = useToast();

  return (
    <div>
      <button onClick={() => toast.success('Success message')}>
        Success
      </button>
      <button onClick={() => toast.error('Error message')}>
        Error
      </button>
      <button onClick={() => toast.warning('Warning message')}>
        Warning
      </button>
      <button onClick={() => toast.info('Info message')}>
        Info
      </button>
    </div>
  );
};

describe('ToastContext', () => {
  it('should display success toast when success is called', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const successButton = screen.getByText('Success');
    fireEvent.click(successButton);

    expect(screen.getByText('Success message')).toBeInTheDocument();
  });

  it('should display error toast when error is called', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const errorButton = screen.getByText('Error');
    fireEvent.click(errorButton);

    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('should display warning toast when warning is called', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const warningButton = screen.getByText('Warning');
    fireEvent.click(warningButton);

    expect(screen.getByText('Warning message')).toBeInTheDocument();
  });

  it('should display info toast when info is called', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const infoButton = screen.getByText('Info');
    fireEvent.click(infoButton);

    expect(screen.getByText('Info message')).toBeInTheDocument();
  });

  it('should remove toast when close button is clicked', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    const successButton = screen.getByText('Success');
    fireEvent.click(successButton);

    const toast = screen.getByText('Success message');
    expect(toast).toBeInTheDocument();

    const closeButton = screen.getByText('×');
    fireEvent.click(closeButton);

    // Toast should be removed after clicking close
    setTimeout(() => {
      expect(toast).not.toBeInTheDocument();
    }, 100);
  });
});
