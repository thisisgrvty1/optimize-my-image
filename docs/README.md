# Optimize my Image - Documentation

Welcome to the official documentation for the "Optimize my Image" application. This document provides a high-level overview of the project, its features, and technology stack.

## Overview

"Optimize my Image" is an advanced, client-side image optimization tool designed for web performance. It allows users to resize, compress, rename, and convert images directly in their browser. A key feature is its privacy-first approach—no images are ever uploaded to a server. The application also leverages the Google Gemini API to intelligently generate SEO-friendly alt text for images.

## Key Features

-   **Client-Side Processing**: All image manipulation happens in the browser, ensuring user data remains 100% private.
-   **Smart Resizing**: Adjust image dimensions while automatically maintaining the aspect ratio.
-   **Powerful Compression**: Fine-tune image quality to find the perfect balance between file size and visual fidelity.
-   **Format Conversion**: Convert images to modern formats like WebP, alongside standard JPEG and PNG.
-   **Batch Processing**: Upload and optimize up to 10 images simultaneously. Apply settings to all images with a single click.
-   **Custom Naming**: Generate clean, descriptive filenames based on project, section, and element names for better SEO and organization.
-   **AI-Powered Alt Text**: Integrates with the Google Gemini API to automatically generate descriptive alt text for images, improving accessibility and SEO.
-   **Theming & Dark Mode**: A customizable UI with multiple color themes and full light/dark mode support.
-   **Multi-language Support**: Available in English and German.

## Technology Stack

-   **Frontend Framework**: [React](https://reactjs.org/) (v19) with TypeScript
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) (via CDN) with custom theming using CSS variables.
-   **AI Integration**: [Google Gemini API](https://ai.google.dev/) via `@google/genai` SDK for alt text generation.
-   **Animations**: [GSAP (GreenSock Animation Platform)](https://greensock.com/gsap/) for advanced landing page animations.
-   **File Packaging**: [JSZip](https://stuk.github.io/jszip/) for exporting multiple images as a single `.zip` file.

## Further Reading

For more detailed information, please refer to the following documents:

-   [**Project Structure**](./STRUCTURE.md): A guide to the folder and file organization.
-   [**Configuration**](./CONFIGURATION.md): How to configure the application, including API keys and theming.
-   [**Formatting & Linting**](./FORMATTING_AND_LINTING.md): Details on the coding standards and style guide.
-   [**Code Fragments**](./CODE_FRAGMENTS.md): Explanations of key architectural patterns and code snippets.