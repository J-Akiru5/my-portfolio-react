/**
 * Smooth Scroll Context Hook
 * 
 * Separated from provider to satisfy Fast Refresh requirements.
 */
import { createContext, useContext } from 'react';

export const SmoothScrollContext = createContext(null);

export const useSmoothScroll = () => useContext(SmoothScrollContext);
