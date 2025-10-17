import Button from '@/components/ui/Button'
import { SiteInfo } from '@/lib/constants'
import AppSettings from '@/components/AppSettings'
import { TabsList, TabsTrigger } from '@/components/ui/Tabs'
import { useSettingsStore } from '@/stores/settings'
import { useAuthStore } from '@/stores/state'
import { cn } from '@/lib/utils'
import { useTranslation } from 'react-i18next'
import { navigationService } from '@/services/navigation'
import { GithubIcon, LogOutIcon } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/Tooltip'
import { useEffect } from 'react'

interface NavigationTabProps {
  value: string
  currentTab: string
  children: React.ReactNode
}

function NavigationTab({ value, currentTab, children }: NavigationTabProps) {
  return (
    <TabsTrigger
      value={value}
      className={cn(
        'cursor-pointer px-2 py-1 transition-all',
        currentTab === value ? '!bg-emerald-400 !text-zinc-50' : 'hover:bg-background/60'
      )}
    >
      {children}
    </TabsTrigger>
  )
}

function TabsNavigation() {
  const currentTab = useSettingsStore.use.currentTab()
  const { t } = useTranslation()
  const { isAdmin, isUser } = useAuthStore()

  useEffect(() => {
    if (isUser && (currentTab === 'documents' || currentTab === 'api')) {
      useSettingsStore.getState().setCurrentTab('knowledge-graph')
      window.location.reload()
    }
  }, [currentTab, isUser])

  return (
    <div className="flex h-8 self-center">
      <TabsList className="h-full gap-2">
        {isAdmin && (
          <NavigationTab value="documents" currentTab={currentTab}>
            {t('header.documents')}
          </NavigationTab>
        )}
        <NavigationTab value="knowledge-graph" currentTab={currentTab}>
          {t('header.knowledgeGraph')}
        </NavigationTab>
        {/*{isAdmin && (*/}
        <NavigationTab value="retrieval" currentTab={currentTab}>
          {t('header.retrieval')}
        </NavigationTab>
        {/*)}*/}
        {isAdmin && (
          <NavigationTab value="api" currentTab={currentTab}>
            {t('header.api')}
          </NavigationTab>
        )}
      </TabsList>
    </div>
  )
}

export default function SiteHeader() {
  const { t } = useTranslation()
  const { isGuestMode, coreVersion, apiVersion, username, webuiTitle, webuiDescription, isAdmin } = useAuthStore()

  const versionDisplay = (coreVersion && apiVersion)
    ? `${coreVersion}/${apiVersion}`
    : null;

  const handleLogout = () => {
    navigationService.navigateToLogin();
  }

  return (
    <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 flex h-10 w-full border-b px-4 backdrop-blur">
      <div className="min-w-[200px] w-auto flex items-center">
        {webuiTitle && (
          <div className="flex items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span className="font-medium text-sm cursor-default">
                    {webuiTitle}
                  </span>
                </TooltipTrigger>
                {webuiDescription && (
                  <TooltipContent side="bottom">
                    {webuiDescription}
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </div>
        )}
      </div>

      <div className="flex h-10 flex-1 items-center justify-center">
        <TabsNavigation />
      </div>

      <nav className="w-[200px] flex items-center justify-end">
        <div className="flex items-center gap-2">
          {isAdmin && versionDisplay && (
            <span className="text-xs text-gray-500 dark:text-gray-400 mr-1">
              v{versionDisplay}
            </span>
          )}
          {isAdmin && (
            <Button variant="ghost" size="icon" side="bottom" tooltip={t('header.projectRepository')}>
              <a href={SiteInfo.github} target="_blank" rel="noopener noreferrer">
                <GithubIcon className="size-4" aria-hidden="true" />
              </a>
            </Button>
          )}
          <AppSettings />
          {!isGuestMode && (
            <Button
              variant="ghost"
              size="icon"
              side="bottom"
              tooltip={`${t('header.logout')} (${username})`}
              onClick={handleLogout}
            >
              <LogOutIcon className="size-4" aria-hidden="true" />
            </Button>
          )}
        </div>
      </nav>
    </header>
  )
}
