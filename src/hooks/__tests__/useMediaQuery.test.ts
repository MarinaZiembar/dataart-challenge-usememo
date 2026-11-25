import { act, renderHook } from '@testing-library/react';
import { useMediaQuery } from '../useMediaQuery';
import { setScreenMatches } from '../../test/matchMedia';

const QUERY = '(min-width: 1024px)';

describe('useMediaQuery', () => {
  it('returns whether the query matches', () => {
    const { result } = renderHook(() => useMediaQuery(QUERY));

    expect(result.current).toBe(true);
  });

  it('updates when the screen changes', () => {
    const { result } = renderHook(() => useMediaQuery(QUERY));

    act(() => setScreenMatches(false));
    expect(result.current).toBe(false);

    act(() => setScreenMatches(true));
    expect(result.current).toBe(true);
  });

  it('stops listening on unmount', () => {
    const removeSpy = jest.fn();
    const original = window.matchMedia;
    window.matchMedia = (query: string) => ({ ...original(query), removeEventListener: removeSpy });

    const { unmount } = renderHook(() => useMediaQuery(QUERY));
    unmount();

    expect(removeSpy).toHaveBeenCalledWith('change', expect.any(Function));
    window.matchMedia = original;
  });
});
