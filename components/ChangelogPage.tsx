import React from 'react';
import { useI8n } from '../hooks/useI8n';
import { changelogData } from '../data/changelogData';
import Card from './ui/Card';
import { ZapIcon } from './icons/ZapIcon';

const ChangelogPage: React.FC = () => {
  const { t } = useI8n();
  const [latest, ...older] = changelogData;

  const renderChanges = (changes: typeof latest.changes) => (
    <div className="space-y-4">
      {changes.map((change, index) => (
        <div key={index}>
          <h4 className={`text-sm font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block mb-3
            ${change.type === 'Added' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : ''}
            ${change.type === 'Changed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' : ''}
            ${change.type === 'Fixed' ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : ''}
          `}>{change.type}</h4>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 pl-2">
            {change.items.map((item, itemIndex) => {
              const parts = item.split(/(\*\*.*?\*\*)/g);
              return (
                <li key={itemIndex}>
                  {parts.map((part, partIndex) => 
                    part.startsWith('**') && part.endsWith('**') ? 
                    <strong key={partIndex} className="font-bold text-foreground-light dark:text-foreground-dark">{part.slice(2, -2)}</strong> : 
                    part
                  )}
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-16">
      {/* Latest Version */}
      <section>
        <h2 className="text-3xl font-black mb-4 text-gradient-theme">{t('changelogLatestVersion')}</h2>
        <Card className="!border-t-8 border-secondary-light dark:border-secondary-dark shadow-xl-theme">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
            <h3 className="text-4xl font-extrabold text-foreground-light dark:text-foreground-dark">
              Version {latest.version}
            </h3>
            <span className="text-gray-500 dark:text-gray-400 font-semibold mt-2 sm:mt-0">{latest.date}</span>
          </div>
          <div className="border-t border-border-light dark:border-border-dark my-6"></div>
          {renderChanges(latest.changes)}
        </Card>
      </section>

      {/* Older Versions */}
      {older.length > 0 && (
        <section>
          <h2 className="text-3xl font-black mb-8 text-center text-foreground-light dark:text-foreground-dark">{t('changelogOlderVersions')}</h2>
          <div className="relative max-w-3xl mx-auto pl-12">
            {/* Timeline Line */}
            <div className="absolute left-4 top-4 bottom-0 w-1 bg-border-light dark:bg-border-dark rounded-full" aria-hidden="true"></div>
            <div className="space-y-10">
              {older.map((entry) => (
                <div key={entry.version} className="relative">
                  {/* Icon */}
                  <div className="absolute -left-[3.2rem] top-1 z-10 flex items-center justify-center w-8 h-8 bg-card-light dark:bg-card-dark rounded-full border-4 border-primary-light dark:border-primary-dark">
                    <ZapIcon className="w-4 h-4 text-primary-light dark:text-primary-dark" />
                  </div>
                  <Card className="!p-4 sm:!p-6 !border-t-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                        <h3 className="text-2xl font-bold text-foreground-light dark:text-foreground-dark">
                          v{entry.version}
                        </h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold mt-1 sm:mt-0">{entry.date}</span>
                      </div>
                       <div className="border-t border-border-light dark:border-border-dark my-4"></div>
                      {renderChanges(entry.changes)}
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ChangelogPage;