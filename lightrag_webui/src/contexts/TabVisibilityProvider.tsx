import React, { useState, useEffect, useMemo } from 'react';
import { TabVisibilityContext } from './context';
import { TabVisibilityContextType } from './types';
import { useSettingsStore } from '@/stores/settings';
import { useAuthStore } from '@/stores/state.ts'

interface TabVisibilityProviderProps {
  children: React.ReactNode;
}

/**
 * Provider component for the TabVisibility context
 * Manages the visibility state of tabs throughout the application
 */
export const TabVisibilityProvider: React.FC<TabVisibilityProviderProps> = ({ children }) => {
  // Get current tab from settings store
  const currentTab = useSettingsStore.use.currentTab();
  const { isAdmin } = useAuthStore()

  // Initialize visibility state with all tabs visible
  const [visibleTabs, setVisibleTabs] = useState<Record<string, boolean>>(() => ({
    'documents': isAdmin,
    'knowledge-graph': true,
    'retrieval': true,
    'api': isAdmin
  }));

  // Keep all tabs visible because we use CSS to control TAB visibility instead of React
  useEffect(() => {
    setVisibleTabs((prev) => ({
      ...prev,
      'documents': isAdmin,
      'knowledge-graph': true,
      'retrieval': true,
      'api': isAdmin
    }));
  }, [currentTab, isAdmin]);

  // Create the context value with memoization to prevent unnecessary re-renders
  const contextValue = useMemo<TabVisibilityContextType>(
    () => ({
      visibleTabs,
      setTabVisibility: (tabId: string, isVisible: boolean) => {
        setVisibleTabs((prev) => ({
          ...prev,
          [tabId]: isVisible,
        }));
      },
      isTabVisible: (tabId: string) => !!visibleTabs[tabId],
    }),
    [visibleTabs]
  );

  return (
    <TabVisibilityContext.Provider value={contextValue}>
      {children}
    </TabVisibilityContext.Provider>
  );
};

export default TabVisibilityProvider;
