export interface ChangelogEntry {
    version: string;
    date: string;
    changes: {
      type: 'Added' | 'Changed' | 'Fixed';
      items: string[];
    }[];
  }
  
  export const changelogData: ChangelogEntry[] = [
    {
      version: '1.4.76',
      date: '2025-09-16',
      changes: [
        {
          type: 'Changed',
          items: [
            '**Performance**: Enhanced code splitting across the application. Route-based components (`LandingPage`, `PrivacyPolicyPage`, etc.) and interaction-based components (modals, overlays) are now loaded on-demand using `React.lazy()` and `<Suspense>`, significantly improving initial load time and reducing the main bundle size.',
            '**Security**: Refactored API key management to align with best practices. The Google API key is now sourced exclusively from the `process.env.API_KEY` environment variable.',
          ],
        },
      ],
    },
    {
      version: '1.4.75',
      date: '2025-09-15',
      changes: [
        {
          type: 'Changed',
          items: [
            '**Accessibility Overhaul**: Conducted a full accessibility audit and implemented major improvements across the application.',
            'All interactive elements are now fully **keyboard-navigable**, including custom controls like sliders and file dropzones.',
            'Enhanced screen reader support with comprehensive **ARIA attributes** for better context and usability.',
            'Updated focus styles to use `:focus-visible` for a cleaner UI that only shows focus rings during keyboard navigation.',
          ],
        },
      ],
    },
    {
      version: '1.4.74',
      date: '2025-09-14',
      changes: [
        {
          type: 'Added',
          items: [
            'Implemented a **magnifying glass feature** on the compressed image preview to inspect quality.',
            'Added a **zoom level selector** (2x, 4x, 6x) to the magnifier for more detailed inspection.',
          ],
        },
      ],
    },
    {
      version: '1.4.73',
      date: '2025-09-13',
      changes: [
        {
          type: 'Fixed',
          items: [
            'Fixed an issue where the **"Add More" button** in the optimizer view failed to open a file selection window, preventing users from adding more images to an existing batch.',
          ],
        },
      ],
    },
    {
      version: '1.4.72',
      date: '2025-09-12',
      changes: [
        {
          type: 'Added',
          items: [
            '**Session Persistence**: The user\'s session, including all uploaded images and their settings, is now automatically saved to local storage. Work is retained across page reloads and browser restarts.',
            '**Active Session Indicator**: A visual indicator with a file count now appears in the header when navigating away from the optimizer, providing a one-click way to return to an active session.',
          ],
        },
      ],
    },
    {
      version: '1.4.71',
      date: '2025-09-11',
      changes: [
        {
          type: 'Changed',
          items: [
            'Redesigned the **Editing Mode Bar** with a bold, saturated, and visually engaging style. The new design features glowing graphical elements and a clearer visual hierarchy to guide the user through batch operations.',
          ],
        },
      ],
    },
    {
      version: '1.4.7',
      date: '2025-09-10',
      changes: [
        {
          type: 'Changed',
          items: [
            'Redesigned and streamlined the **Editing Mode Bar** for a cleaner user interface and improved visual hierarchy. The new design separates the primary action from secondary controls on desktop and provides a structured, user-friendly layout on mobile devices.',
          ],
        },
      ],
    },
    {
      version: '1.4.6',
      date: '2025-09-09',
      changes: [
        {
          type: 'Added',
          items: [
            'Added a **"Generate All SEO"** button to the batch actions bar to generate alt text for all uploaded images at once using the Gemini API.',
          ],
        },
        {
          type: 'Changed',
          items: [
            'Improved the layout of the batch actions bar on desktop devices for a cleaner, more organized **single-row appearance**.',
            'Enhanced the **visual hierarchy** of the batch action buttons.',
          ],
        },
      ],
    },
    {
      version: '1.4.5',
      date: '2025-09-08',
      changes: [
        {
          type: 'Changed',
          items: [
            'Redesigned the "Drag & Drop" section on the landing page with a **bold, modern, typographic style**. The new design is simple and bright, featuring a glowing icon on a transparent background, with no shadows or text-shadows.',
          ],
        },
      ],
    },
    {
      version: '1.4.4',
      date: '2025-09-07',
      changes: [
        {
          type: 'Changed',
          items: [
            'Reworked the theme and dark mode switchers for **improved performance** and a simpler user experience on mobile devices.',
            'Optimized global color transition animations for **smoother performance** across the application.',
          ],
        },
      ],
    },
    {
      version: '1.4.3',
      date: '2025-09-06',
      changes: [
        {
            type: 'Fixed',
            items: [
              'Resolved horizontal overflow issues on mobile devices for a cleaner, contained layout, ensuring decorative elements do not break the viewport.',
            ],
        },
        {
          type: 'Changed',
          items: [
            'Updated application version across the UI and project files to **1.4.3**.',
          ],
        },
      ],
    },
    {
      version: '1.4.2',
      date: '2025-09-05',
      changes: [
        {
          type: 'Added',
          items: [
            '**Changelog Page**: Created a dedicated changelog page accessible by clicking the version number in the header or footer.',
            "The new page highlights the latest version's changes and provides a historical list of all previous updates.",
          ],
        },
      ],
    },
    {
      version: '1.4.1',
      date: '2025-09-04',
      changes: [
        {
          type: 'Changed',
          items: [
            '**Mobile Performance Overhaul**: Significantly improved performance and responsiveness on mobile devices.',
            'Replaced performance-intensive scroll-linked animations (scrub) with lightweight, viewport-triggered animations on smaller screens.',
            'Reduced the intensity of demanding CSS effects like background blurs and glows on mobile to ensure a smooth, jank-free experience.',
            'Adjusted typography and layout elements in the landing page for better readability and usability on mobile viewports.',
          ],
        },
      ],
    },
    {
        version: '1.4.0',
        date: '2025-09-03',
        changes: [
          {
            type: 'Changed',
            items: [
              'Newly uploaded images now appear at the **top of the list** for easier access and a more intuitive workflow.',
            ],
          },
        ],
    },
    {
        version: '1.3.9',
        date: '2025-09-02',
        changes: [
          {
            type: 'Changed',
            items: [
              '**Project Architecture Overhaul**: Transitioned the application from a browser-based, import-map/CDN setup to a standard **Vite build system**.',
            ],
          },
          {
            type: 'Added',
            items: [
              'Standard project configuration files: `package.json`, `vite.config.ts`, and `tsconfig.json`.',
              'A `.gitignore` file to follow best practices for version control.',
            ],
          },
        ],
    },
    {
        version: '1.3.8',
        date: '2025-08-31',
        changes: [
          {
            type: 'Changed',
            items: [
              '**Landing Page Section Order**: Reordered the sections on the landing page for a more intuitive and impactful user flow.',
              '**Landing Page Redesign**: Redesigned the "Packed with Powerful Features" section with a vibrant, glowing aesthetic.',
              '**Privacy Section Animation**: Enhanced the "Private & Secure" section with a bold, attention-grabbing animation, including a radiating "shockwave" pulse.',
            ],
          },
        ],
    },
    {
        version: '1.3.7',
        date: '2025-08-30',
        changes: [
            {
                type: 'Added',
                items: [
                    '**Live Image Preview**: Implemented a side-by-side "Original vs. Preview" view in the image editor.',
                    '**AI Feature Section**: Added a new dedicated section to the landing page to highlight the "AI-Powered Alt Text" generation feature.',
                    '**Comprehensive History**: Created a detailed version history in `CHANGELOG.md`.',
                ],
            },
            {
                type: 'Changed',
                items: [
                    '**Default Theme**: The default color theme has been changed from "orange" to "green".',
                    '**Landing Page Redesign**: Overhauled several sections with a vibrant, glowing, glass-blur aesthetic.',
                    '**Landing Page Animations**: Reworked on-scroll animations for a more dynamic entrance.',
                ],
            },
        ],
    },
    {
        version: '1.3.6',
        date: '2025-08-28',
        changes: [
            {
                type: 'Changed',
                items: [
                    'Renamed the "Optimize & Transform" tab to **"Image Settings"** for better clarity.',
                    'Reordered fields to a more logical flow: Dimensions, Quality, and Format.',
                ],
            },
        ],
    },
    {
        version: '1.3.5',
        date: '2025-08-27',
        changes: [
            {
                type: 'Added',
                items: [
                    '**Global drag-and-drop support**. Users can now drop images anywhere on the application window.',
                    'A full-screen overlay now provides visual feedback during the drag operation.',
                ],
            },
        ],
    },
    {
        version: '1.3.4',
        date: '2025-08-25',
        changes: [
            {
                type: 'Added',
                items: [
                    'Comprehensive project documentation in a new `/docs` folder.',
                    'Redesigned tab-based interface for the image settings panel.',
                    'Dynamic, color-coded feedback for the estimated file size.',
                ],
            },
            {
                type: 'Changed',
                items: [
                    'Streamlined settings workflow by merging "Optimize" and "Transform" controls.',
                ],
            },
            {
                type: 'Fixed',
                items: [
                    'Resolved intermittent "Failed to create blob from canvas" errors.',
                    'Corrected a JavaScript module import error for the `useI8n` hook.',
                ],
            },
        ],
    },
    {
        version: '1.3.3',
        date: '2025-08-22',
        changes: [
            {
                type: 'Added',
                items: [
                    'A new, beautifully animated **landing page** with smooth on-scroll animations using GSAP.',
                ],
            },
        ],
    },
    {
        version: '1.3.2',
        date: '2025-08-20',
        changes: [
            {
                type: 'Added',
                items: [
                    '**AI-powered alt text generation** by integrating the Google Gemini API.',
                    'An API Key modal to allow users to securely add their own Google API key.',
                ],
            },
        ],
    },
    {
        version: '1.3.1',
        date: '2025-08-18',
        changes: [
            {
                type: 'Added',
                items: [
                    '**Internationalization (i18n)** support.',
                    'German language translations for the entire user interface.',
                    'A language switcher component in the header.',
                ],
            },
        ],
    },
    {
        version: '1.3.0',
        date: '2025-08-15',
        changes: [
            {
                type: 'Added',
                items: [
                    'Support for converting images to the modern **WebP** format.',
                    'Advanced file naming options to generate SEO-friendly filenames.',
                ],
            },
        ],
    },
    {
        version: '1.2.1',
        date: '2025-08-10',
        changes: [
            {
                type: 'Changed',
                items: [
                    'Improved performance of UI animations and transitions.',
                    'Optimized initial asset loading.',
                ],
            },
        ],
    },
    {
        version: '1.2.0',
        date: '2025-08-08',
        changes: [
            {
                type: 'Added',
                items: [
                    'A complete user interface overhaul with a modern, clean design.',
                    '**Dark mode** support.',
                    'A theme switcher with multiple color palettes.',
                ],
            },
        ],
    },
    {
        version: '1.1.1',
        date: '2025-08-05',
        changes: [
            {
                type: 'Fixed',
                items: [
                    'Fixed an issue where exporting many images could cause a crash.',
                    'Improved error handling for failed image processing.',
                ],
            },
        ],
    },
    {
        version: '1.1.0',
        date: '2025-08-01',
        changes: [
            {
                type: 'Added',
                items: [
                    '**Batch processing** capability for up to 10 images at once.',
                    '**"Export All"** feature which packages images into a single ZIP file.',
                ],
            },
        ],
    },
    {
        version: '1.0.0',
        date: '2025-07-20',
        changes: [
            {
                type: 'Added',
                items: [
                    '**Initial release** of "Optimize my Image".',
                    'Core client-side image optimization features: resizing and quality compression.',
                    'Support for JPEG and PNG formats.',
                    'Real-time estimated file size calculation.',
                ],
            },
        ],
    },
  ];