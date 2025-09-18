import React, { useState, useEffect } from 'react';
import { useI8n } from '../hooks/useI8n';
import Card from './ui/Card';
import { SpinnerIcon } from './icons/SpinnerIcon';
import { TagIcon } from './icons/TagIcon';

interface ChangelogEntry {
  version: string;
  date: string;
  changes: { type: string; items: string[] }[];
}

const parseChangelog = (markdown: string): ChangelogEntry[] => {
  const entries: ChangelogEntry[] = [];
  const versionRegex = /^## \[(.*?)\] - (.*?)$/gm;
  const parts = markdown.split(versionRegex);
  
  parts.shift(); // Remove content before the first version

  for (let i = 0; i < parts.length; i += 3) {
    const version = parts[i];
    const date = parts[i + 1];
    const content = parts[i + 2];
    
    if (!version || !content) continue;

    const changes: { type: string; items: string[] }[] = [];
    const changeTypeRegex = /^### (.*?)$/gm;
    const changeSections = content.split(changeTypeRegex);
    changeSections.shift(); // Remove content before the first change type

    for (let j = 0; j < changeSections.length; j += 2) {
      const type = changeSections[j];
      const itemsText = changeSections[j + 1];
      if (!type || !itemsText) continue;

      const items = itemsText.split('\n').map(line => line.replace(/^- /, '').trim()).filter(line => line);
      changes.push({ type, items });
    }

    entries.push({ version, date, changes });
  }

  return entries;
};

const ChangelogPage: React.FC = () => {
  const { t } = useI8n();
  const [changelog, setChangelog] = useState<ChangelogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChangelog = async () => {
      try {
        const response = await fetch('/CHANGELOG.md');
        if (!response.ok) {
          throw new Error(`Failed to fetch changelog: ${response.statusText}`);
        }
        const markdown = await response.text();
        const parsed = parseChangelog(markdown);
        setChangelog(parsed);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChangelog();
  }, []);

  const latestEntry = changelog[0];
  const olderEntries = changelog.slice(1);

  const renderEntry = (entry: ChangelogEntry) => (
    <div key={entry.version} className="prose dark:prose-invert max-w-none prose-h3:font-bold prose-ul:list-disc prose-ul:pl-6 prose-li:my-1">
      <div className="flex items-baseline space-x-3 mb-4">
        <h2 className="text-3xl font-extrabold m-0 text-foreground-light dark:text-foreground-dark">
          v{entry.version}
        </h2>
        <time className="text-sm font-semibold text-gray-500 dark:text-gray-400">{entry.date}</time>
      </div>
      {entry.changes.map(({ type, items }) => (
        <div key={type} className="mb-4">
          <h3 className="font-bold text-lg mb-2">{type}</h3>
          <ul className="space-y-2">
            {items.map((item, index) => (
              <li key={index} className="text-foreground-light dark:text-foreground-dark/90" dangerouslySetInnerHTML={{ __html: item.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }}/>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );

  return (
    <Card>
      <div className="flex items-center space-x-4 mb-8 pb-4 border-b border-border-light dark:border-border-dark">
        <div className="text-primary-light dark:text-primary-dark p-3 bg-primary-light/10 dark:bg-primary-dark/10 rounded-full">
            <TagIcon className="w-8 h-8"/>
        </div>
        <h1 className="text-4xl font-black">{t('changelogTitle')}</h1>
      </div>
      
      {isLoading && (
        <div className="flex justify-center items-center py-20">
          <SpinnerIcon className="w-12 h-12 animate-spin text-primary-light dark:text-primary-dark" />
        </div>
      )}
      
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!isLoading && !error && (
        <div className="space-y-12">
          {latestEntry && (
            <section aria-labelledby="latest-version-heading">
              <h2 id="latest-version-heading" className="text-lg font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">{t('latestVersion')}</h2>
              <Card className="border-2 border-primary-light dark:border-primary-dark shadow-xl-theme">
                {renderEntry(latestEntry)}
              </Card>
            </section>
          )}

          {olderEntries.length > 0 && (
            <section aria-labelledby="version-history-heading">
              <h2 id="version-history-heading" className="text-lg font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">{t('versionHistory')}</h2>
              <div className="space-y-8">
                {olderEntries.map(entry => (
                  <div key={entry.version} className="p-6 rounded-2xl bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark">
                    {renderEntry(entry)}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}
    </Card>
  );
};

export default ChangelogPage;
