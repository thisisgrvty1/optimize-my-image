

import React from 'react';
import { View } from '../types';
import { useI8n } from '../hooks/useI8n';
import { ChevronRightIcon } from './icons/ChevronRightIcon';

interface BreadcrumbsProps {
  view: View;
  onNavigateHome: () => void;
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ view, onNavigateHome }) => {
  const { t } = useI8n();

  if (view === 'landing') {
    return null; // Don't show breadcrumbs on the landing page
  }
  
  const pageTitleMap: Record<Exclude<View, 'landing'>, string> = {
    optimizer: t('breadcrumbOptimizer'),
    imprint: t('breadcrumbImprint'),
    privacy: t('breadcrumbPrivacyPolicy'),
  };

  return (
    <nav className="mb-6 flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <button
            onClick={onNavigateHome}
            className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-primary-light dark:text-gray-400 dark:hover:text-white"
          >
            {t('breadcrumbHome')}
          </button>
        </li>
        <li>
          <div className="flex items-center">
            <ChevronRightIcon className="w-5 h-5 text-gray-400" />
            <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 dark:text-gray-400">
              {pageTitleMap[view]}
            </span>
          </div>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
