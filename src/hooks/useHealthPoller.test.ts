import { renderHook, act } from '@testing-library/react';
import { useHealthPoller } from './useHealthPoller';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

// Mock the zustand store module completely
const mockConnectProfile = vi.fn();
let mockProfiles = [{ id: 'p1' }];

vi.mock('@/store/serverStore', () => ({
  useServerStore: vi.fn((selector) => {
    return selector({
      profiles: mockProfiles,
      connectProfile: mockConnectProfile,
    });
  }),
}));

describe('useHealthPoller', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockConnectProfile.mockClear();
    mockProfiles = [{ id: 'p1' }];

    // Reset the internal ref in the hook by remounting isn't enough,
    // the ref is local to the hook instance. But since we use renderHook
    // per test, it's a fresh instance each time.

    // Mock document.visibilityState
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    });
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it('does not poll if there are no profiles', () => {
    mockProfiles = [];
    renderHook(() => useHealthPoller());
    expect(mockConnectProfile).not.toHaveBeenCalled();
  });

  it('performs an initial poll when profiles exist', () => {
    renderHook(() => useHealthPoller());
    expect(mockConnectProfile).toHaveBeenCalledWith('p1');
    expect(mockConnectProfile).toHaveBeenCalledTimes(1);
  });

  it('polls on a 30 second interval when visible', () => {
    renderHook(() => useHealthPoller());
    mockConnectProfile.mockClear();

    // Advance by 30 seconds
    act(() => {
      vi.advanceTimersByTime(30_000);
    });

    expect(mockConnectProfile).toHaveBeenCalledWith('p1');
    expect(mockConnectProfile).toHaveBeenCalledTimes(1);

    // Advance by another 30 seconds
    act(() => {
      vi.advanceTimersByTime(30_000);
    });

    expect(mockConnectProfile).toHaveBeenCalledTimes(2);
  });

  it('does not poll on interval when document is hidden', () => {
    renderHook(() => useHealthPoller());
    mockConnectProfile.mockClear();

    // Set document as hidden
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'hidden',
    });

    // Advance by 30 seconds
    act(() => {
      vi.advanceTimersByTime(30_000);
    });

    // Should not have polled because it's hidden
    expect(mockConnectProfile).not.toHaveBeenCalled();
  });

  it('polls when document visibility changes to visible', () => {
    renderHook(() => useHealthPoller());
    mockConnectProfile.mockClear();

    // First, set it to hidden
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'hidden',
    });

    // Simulate visibility change to hidden
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });
    expect(mockConnectProfile).not.toHaveBeenCalled();

    // Now set back to visible
    Object.defineProperty(document, 'visibilityState', {
      configurable: true,
      get: () => 'visible',
    });

    // Simulate visibility change to visible
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(mockConnectProfile).toHaveBeenCalledWith('p1');
    expect(mockConnectProfile).toHaveBeenCalledTimes(1);
  });

  it('cleans up intervals and event listeners on unmount', () => {
    const addEventListenerSpy = vi.spyOn(document, 'addEventListener');
    const removeEventListenerSpy = vi.spyOn(document, 'removeEventListener');
    const clearIntervalSpy = vi.spyOn(global, 'clearInterval');

    const { unmount } = renderHook(() => useHealthPoller());

    expect(addEventListenerSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));

    mockConnectProfile.mockClear();

    unmount();

    expect(clearIntervalSpy).toHaveBeenCalled();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('visibilitychange', expect.any(Function));

    // Ensure that after unmount, interval does not trigger polling
    act(() => {
      vi.advanceTimersByTime(30_000);
    });

    // Ensure that after unmount, visibilitychange does not trigger polling
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(mockConnectProfile).not.toHaveBeenCalled();
  });
});
