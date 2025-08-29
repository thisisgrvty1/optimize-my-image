
import React, { useRef, useLayoutEffect } from 'react';
import { useI8n } from '../hooks/useI8n';
import Button from './ui/Button';
import { ResizeIcon } from './icons/ResizeIcon';
import { CompressIcon } from './icons/CompressIcon';
import { BatchIcon } from './icons/BatchIcon';
import { RenameIcon } from './icons/RenameIcon';
import { ShieldIcon } from './icons/ShieldIcon';
import { ImageIcon } from './icons/ImageIcon';
import { ArrowRightIcon } from './icons/ArrowRightIcon';
import { useTheme } from '../contexts/ThemeContext';
import { UploadIcon } from './icons/UploadIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { SlidersIcon } from './icons/SlidersIcon';
import { ZapIcon } from './icons/ZapIcon';
import { SparklesIcon } from './icons/SparklesIcon';

// Declare GSAP globals for TypeScript
declare const gsap: any;
declare const ScrollTrigger: any;

interface LandingPageProps {
  onStart: () => void;
  playIntro: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ onStart, playIntro }) => {
  const { t } = useI8n();
  const component = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.error("GSAP or ScrollTrigger not loaded");
        return;
    }
    gsap.registerPlugin(ScrollTrigger);
    
    const ctx = gsap.context(() => {
        // --- PERFORMANCE & AESTHETIC SETTINGS ---
        const scrubVal = true; // Use GSAP's built-in smoothing for a natural feel
        ScrollTrigger.defaults({ markers: false }); // Change to true for debugging

        // --- INTRO ANIMATION ---
        if (playIntro) {
            gsap.timeline({ defaults: { ease: 'power3.out' } })
              .from('.hero-title', { opacity: 0, y: 30, duration: 0.7, delay: 0.3 })
              .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.6 }, "-=0.5")
              .from('.hero-cta', { opacity: 0, y: 20, duration: 0.6 }, "-=0.5")
              .from('.hero-visual', { opacity: 0, scale: 0.9, y: 40, duration: 0.8 }, "-=0.6");
        }

        // --- HERO PARALLAX ---
        gsap.timeline({
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: scrubVal,
            }
        })
        .to('.hero-title, .hero-subtitle, .hero-cta', { yPercent: -40, autoAlpha: 0 }, 0)
        .to('.hero-visual', { yPercent: 20, scale: 0.9, autoAlpha: 0.5 }, 0);

        // --- SECTION TITLES ---
        gsap.utils.toArray('.section-title').forEach((el: HTMLElement) => {
            gsap.from(el, {
                yPercent: 50,
                autoAlpha: 0,
                scrollTrigger: {
                    trigger: el,
                    start: 'top 90%',
                    end: 'top 70%',
                    scrub: scrubVal,
                }
            });
        });
        
        // --- DRAG & DROP GLOW SECTION ---
        const dndGlowSection = '.drag-drop-glow-section';
        if (document.querySelector(dndGlowSection)) {
            gsap.from(dndGlowSection, {
                yPercent: 20,
                autoAlpha: 0,
                scale: 0.9,
                scrollTrigger: {
                    trigger: '.hero-section',
                    start: 'bottom 80%',
                    end: 'bottom 50%',
                    scrub: scrubVal,
                }
            });
        }
        
        // --- FEATURES SECTION ---
        gsap.from('.features-section .glass-card-glow', {
            yPercent: 20,
            autoAlpha: 0,
            scale: 0.9,
            scrollTrigger: {
                trigger: '.features-section',
                start: 'top 80%',
                end: 'center 70%',
                scrub: scrubVal,
            }
        });

        // --- AI FEATURE SECTION ---
        const aiSection = '.ai-feature-section';
        if (document.querySelector(aiSection)) {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: aiSection,
                    start: 'top 80%',
                    end: 'center 70%',
                    scrub: scrubVal,
                }
            });
            // Animate the title first, as requested
            tl.from('.ai-text-content .section-title', {
                autoAlpha: 0,
                y: 30,
                ease: 'power2.out'
            })
            // Then, animate the description text
            .from('.ai-text-content .section-description', {
                autoAlpha: 0,
                y: 20,
                ease: 'power2.out'
            }, '+=0.2') // Stagger slightly after the title
            // Animate the visual content to appear alongside the description for a dynamic effect
            .from('.ai-visual-content', {
                autoAlpha: 0,
                scale: 0.8,
                rotation: -5,
                y: 50,
                ease: 'power2.out'
            }, '<'); // '<' starts this animation at the same time as the previous one (the description)
              
            // Demo animation
            const demoTl = gsap.timeline({
                scrollTrigger: {
                    trigger: aiSection,
                    start: 'center 75%',
                    toggleActions: 'play none none reverse'
                },
                defaults: { ease: 'power2.inOut' }
            });
            demoTl.to('.ai-generate-button', { autoAlpha: 0, scale: 0.8, duration: 0.4, delay: 2 })
                  .to('.ai-alt-text-result', { autoAlpha: 1, duration: 0.4 }, '-=0.2');
        }
        
        // --- FINAL CTA ---
        const ctaTl = gsap.timeline({
            scrollTrigger: {
                trigger: '.final-cta-section',
                start: 'top 80%',
                end: 'center 70%',
                scrub: scrubVal,
            }
        });
        ctaTl.from('.cta-text-content > *', { y: 30, autoAlpha: 0, stagger: 0.15 })
             .from('.cta-visual-content', { scale: 0.9, autoAlpha: 0 }, "-=0.3");

        // --- PRIVACY SECTION ---
        gsap.from('.privacy-section .privacy-content', {
            yPercent: 20,
            autoAlpha: 0,
            scale: 0.9,
            scrollTrigger: {
                trigger: '.privacy-section',
                start: 'top 80%',
                end: 'center 70%',
                scrub: scrubVal,
            }
        });
        
        // --- HOW IT WORKS SECTION ---
        gsap.utils.toArray('.how-it-works-step').forEach((step: HTMLElement, i: number) => {
            const isReversed = i % 2 !== 0;
            const visual = step.querySelector('.step-visual');
            const textElements = step.querySelectorAll('.step-text > *');

            gsap.set(visual, { autoAlpha: 0, y: 50, scale: 0.9 });
            gsap.set(textElements, { autoAlpha: 0, x: isReversed ? 50 : -50 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: step,
                    start: 'top 85%',
                    end: 'center 70%',
                    scrub: scrubVal,
                }
            });

            tl.to(visual, { autoAlpha: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' })
              .to(textElements, {
                  autoAlpha: 1,
                  x: 0,
                  stagger: 0.1,
                  duration: 0.8,
                  ease: 'power3.out'
              }, "-=0.8");
            
            // Parallax effect for the visual element
            gsap.to(visual, {
                yPercent: -15,
                ease: 'none',
                scrollTrigger: {
                    trigger: step,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: scrubVal
                }
            });
        });
        
        const ctaButton = ".how-it-works-cta";
        if (document.querySelector(ctaButton)) {
            gsap.from(ctaButton, {
                autoAlpha: 0,
                y: 50,
                scrollTrigger: {
                    trigger: ctaButton,
                    start: 'top 95%',
                    end: 'bottom 80%',
                    scrub: scrubVal,
                }
            });
        }

    }, component);

    return () => ctx.revert();
  }, [playIntro]);

  const features = [
    { icon: <ResizeIcon className="w-10 h-10" />, title: t('featureResizeTitle'), description: t('featureResizeDesc') },
    { icon: <CompressIcon className="w-10 h-10" />, title: t('featureCompressTitle'), description: t('featureCompressDesc') },
    { icon: <BatchIcon className="w-10 h-10" />, title: t('featureBatchTitle'), description: t('featureBatchDesc') },
    { icon: <RenameIcon className="w-10 h-10" />, title: t('featureRenameTitle'), description: t('featureRenameDesc') },
  ];
  
  const progressBarClass = 'progress-bar-gradient';
  
  const optimizedTextColorClass = 'text-green-500 dark:text-green-400';

  return (
    <div className="space-y-20 md:space-y-32" ref={component}>
      {/* Hero Section */}
      <section className="hero-section relative container mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 items-center gap-12 lg:gap-16 py-16">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] sm:w-[60rem] sm:h-[60rem] bg-primary-light/10 dark:bg-primary-dark/10 rounded-full blur-[150px] sm:blur-[200px] -z-10"></div>
        
        {/* Left Side: Text Content */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <h1 className="hero-title text-5xl md:text-7xl font-black mb-4 text-gradient-theme bg-clip-text text-transparent !leading-tight">
                {t('landingHeroTitle')}
            </h1>
            <p className="hero-subtitle max-w-xl text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8">
                {t('landingHeroSubtitle')}
            </p>
            <div className="hero-cta">
                <Button onClick={onStart} className="px-10 py-4 text-xl font-bold">
                    {t('landingStartButton')}
                </Button>
            </div>
        </div>

        {/* Right Side: Visual Demo */}
        <div className="hero-visual relative w-full max-w-md mx-auto lg:max-w-none lg:mx-0">
            <div className="bg-card-light/50 dark:bg-card-dark/50 backdrop-blur-lg rounded-3xl border border-border-light dark:border-border-dark shadow-xl-theme p-4 sm:p-6 transition-all duration-300">
                {/* Header */}
                <div className="flex items-center space-x-2 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>

                {/* Image placeholder */}
                <div className="relative aspect-video bg-background-light dark:bg-background-dark rounded-xl flex items-center justify-center border-2 border-dashed border-border-light dark:border-border-dark overflow-hidden">
                    <ImageIcon className="w-1/3 h-1/3 text-gray-300 dark:text-gray-600" />
                </div>

                {/* Stats */}
                <div className="flex justify-between items-center mt-4">
                    <div className="text-left">
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Original</p>
                        <p className="text-lg sm:text-xl font-bold">2.4 MB</p>
                    </div>
                    <ArrowRightIcon className="w-8 h-8 sm:w-10 sm:h-10 text-primary-light dark:text-primary-dark mx-2 flex-shrink-0" />
                    <div className="text-right">
                        <p className={`text-xs sm:text-sm ${optimizedTextColorClass}`}>Optimized</p>
                        <p className={`text-lg sm:text-xl font-bold ${optimizedTextColorClass}`}>158 KB</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3 mt-4 overflow-hidden">
                    <div className={`${progressBarClass} h-full rounded-full ${playIntro ? 'animate-progress-bar' : 'w-full'}`}></div>
                </div>
            </div>
        </div>
      </section>

      {/* Drag and Drop Section */}
      <section className="drag-drop-glow-section container mx-auto -mt-16 md:-mt-24 relative z-10 rounded-[40px]">
        <div className="blob blob1" aria-hidden="true"></div>
        <div className="blob blob2" aria-hidden="true"></div>
        <div className="relative glass-card-glow rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 text-center">
          <div className="relative z-10 flex flex-col items-center">
            <div className="mb-6 animate-icon-glow">
              <UploadIcon className="w-16 h-16 md:w-20 md:h-20 text-primary-light dark:text-primary-dark" />
            </div>
            <h2 className="section-title text-4xl font-black mb-4 text-gradient-theme">{t('featureDragDropTitle')}</h2>
            <p className="section-description max-w-2xl mx-auto text-lg text-foreground-light/90 dark:text-foreground-dark/90">{t('featureDragDropDesc')}</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section drag-drop-glow-section container mx-auto rounded-[40px]">
        <div className="blob blob1" aria-hidden="true" style={{ background: 'rgb(var(--color-primary-light))', animationDuration: '20s' }}></div>
        <div className="blob blob2" aria-hidden="true" style={{ background: 'rgb(var(--color-secondary-light))', animationDuration: '25s' }}></div>
        <div className="relative glass-card-glow rounded-[2rem] md:rounded-[3rem] p-8 md:p-12">
            <div className="relative z-10 flex flex-col items-center text-center">
                <h2 className="section-title text-4xl font-black mb-12 text-gradient-theme">{t('featuresTitle')}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12 w-full">
                    {features.map((feature, index) => (
                        <div key={feature.title} className="flex flex-col items-center">
                            <div className="mb-4 animate-icon-glow text-primary-light dark:text-primary-dark" style={{ animationDelay: `${index * 150}ms` }}>
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-2 text-foreground-light dark:text-foreground-dark">{feature.title}</h3>
                            <p className="text-base text-gray-600 dark:text-gray-400">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </section>

      {/* AI Alt Text Feature Section */}
      <section className="ai-feature-section container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Visual Demo */}
          <div className="ai-visual-content relative w-full max-w-md mx-auto lg:max-w-none lg:mx-0 lg:order-last">
            <div className="bg-card-light/50 dark:bg-card-dark/50 backdrop-blur-lg rounded-3xl border border-border-light dark:border-border-dark shadow-xl-theme p-4 sm:p-6">
              <div className="relative aspect-video bg-background-light dark:bg-background-dark rounded-xl flex items-center justify-center border-2 border-dashed border-border-light dark:border-border-dark overflow-hidden mb-4">
                  <ImageIcon className="w-1/3 h-1/3 text-gray-300 dark:text-gray-600" />
              </div>
              <div className="relative h-20">
                  <div className="ai-generate-button absolute inset-0 flex items-center justify-center">
                      <Button variant="ghost">
                          <SparklesIcon className="w-5 h-5 mr-2" />
                          {t('generateAltText')}
                      </Button>
                  </div>
                  <div className="ai-alt-text-result absolute inset-0 flex items-center justify-center bg-background-light dark:bg-background-dark p-3 rounded-lg opacity-0">
                      <p className="text-sm font-semibold text-center text-foreground-light dark:text-foreground-dark">
                        "{t('featureAiExample')}"
                      </p>
                  </div>
              </div>
            </div>
          </div>
          {/* Text Content */}
          <div className="ai-text-content text-center lg:text-left">
            <h2 className="section-title text-4xl font-black mb-4 text-gradient-theme">{t('featureAiTitle')}</h2>
            <p className="section-description max-w-xl mx-auto lg:mx-0 text-lg text-gray-600 dark:text-gray-300">{t('featureAiDesc')}</p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="final-cta-section relative py-20 lg:py-32 overflow-hidden bg-background-light dark:bg-slate-900/[0.5]">
        <div className="cta-background-glow" aria-hidden="true"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div className="cta-text-content text-center lg:text-left flex flex-col items-center lg:items-start">
                <h2 className="text-4xl md:text-5xl font-black mb-6 text-gradient-theme !leading-tight">{t('finalCtaTitle')}</h2>
                <p className="text-lg text-foreground-light dark:text-foreground-dark mb-8 max-w-xl">
                {t('finalCtaSubtitle')}
                </p>
                <Button onClick={onStart} className="px-10 py-4 text-xl font-bold">
                {t('finalCtaButton')}
                </Button>
            </div>
            
            {/* Visual Demo */}
            <div className="cta-visual-content flex justify-center">
                <div className="w-full max-w-md bg-card-light/50 dark:bg-card-dark/50 backdrop-blur-lg rounded-3xl border border-border-light dark:border-border-dark shadow-xl-theme p-6">
                <div className="flex items-center justify-around">
                    {/* Before */}
                    <div className="text-center p-4 rounded-xl">
                    <ImageIcon className="w-16 h-16 mx-auto text-foreground-light/60 dark:text-foreground-dark/60 mb-3" />
                    <p className="text-sm font-bold text-foreground-light dark:text-foreground-dark opacity-80">BEFORE</p>
                    <p className="text-2xl font-bold text-foreground-light dark:text-foreground-dark">1.8 MB</p>
                    <span className="text-xs font-semibold text-foreground-light/80 dark:text-foreground-dark/80 bg-foreground-light/5 dark:bg-foreground-dark/5 px-2 py-0.5 rounded-full">JPEG</span>
                    </div>
                    
                    {/* Zap Icon */}
                    <div className="cta-zap-icon text-primary-light dark:text-primary-dark">
                    <ZapIcon className="w-12 h-12"/>
                    </div>

                    {/* After */}
                    <div className="text-center p-4 rounded-xl bg-primary-light/10 dark:bg-primary-dark/10">
                    <ImageIcon className="w-16 h-16 mx-auto text-primary-light dark:text-primary-dark mb-3" />
                    <p className="text-sm font-bold text-primary-light dark:text-primary-dark">AFTER</p>
                    <p className="text-2xl font-bold text-foreground-light dark:text-foreground-dark">120 KB</p>
                    <span className="text-xs font-semibold text-white bg-primary-light dark:bg-primary-dark px-2 py-0.5 rounded-full">WebP</span>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
      </section>

      {/* Privacy Feature Section */}
      <section className="privacy-section drag-drop-glow-section container mx-auto rounded-[40px]">
        <div className="blob blob1" aria-hidden="true" style={{ background: 'rgb(var(--color-secondary-light))', animationDuration: '18s' }}></div>
        <div className="blob blob2" aria-hidden="true" style={{ background: 'rgb(var(--color-primary-light))', animationDuration: '22s' }}></div>
        <div className="privacy-content relative glass-card-glow rounded-[2rem] md:rounded-[3rem] p-8 md:p-12">
          <div className="relative z-10 flex flex-col items-center text-center">
              <div className="mb-6 relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24">
                {/* Shockwave effect wrapper */}
                <div className="animate-shockwave absolute inset-0">
                    <span />
                    <span />
                    <span />
                </div>
                <ShieldIcon className="relative w-16 h-16 md:w-20 md:h-20 text-primary-light dark:text-primary-dark animate-icon-glow-intense" />
              </div>
              <h2 className="section-title text-4xl font-black mb-4 text-gradient-theme">{t('featurePrivacyTitle')}</h2>
              <p className="section-description max-w-2xl mx-auto text-lg text-foreground-light/90 dark:text-foreground-dark/90">{t('featurePrivacyDesc')}</p>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="how-it-works-section relative py-20 lg:py-32">
        {/* Animated Gradient Background */}
        <div className="gradient-bg" aria-hidden="true">
            <div className="blob blob1"></div>
            <div className="blob blob2"></div>
            <div className="blob blob3"></div>
        </div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="section-title text-4xl font-black text-center mb-20 text-foreground-light dark:text-foreground-dark drop-shadow-lg">{t('howItWorksTitle')}</h2>

            <div className="space-y-24 md:space-y-32">
                {/* Step 1 */}
                <div className="how-it-works-step grid md:grid-cols-2 gap-12 items-center">
                    <div className="step-text md:pr-8 relative pt-12">
                        <div className="step-number text-[10rem] font-black text-foreground-light/10 dark:text-foreground-dark/10 leading-none absolute top-0 left-0 -z-10">01</div>
                        <h3 className="text-4xl font-bold text-foreground-light dark:text-foreground-dark drop-shadow-md mb-4">{t('step1Title')}</h3>
                        <p className="text-lg text-foreground-light/80 dark:text-foreground-dark/80">{t('step1Desc')}</p>
                    </div>
                    <div className="step-visual flex justify-center">
                        <div className="p-8 rounded-[2rem] glass-card w-full max-w-md aspect-video flex items-center justify-center">
                            <UploadIcon className="w-24 h-24 text-foreground-light dark:text-foreground-dark opacity-80" />
                        </div>
                    </div>
                </div>

                {/* Step 2 */}
                <div className="how-it-works-step grid md:grid-cols-2 gap-12 items-center">
                    <div className="step-visual flex justify-center md:order-last">
                        <div className="p-8 rounded-[2rem] glass-card w-full max-w-md aspect-video flex items-center justify-center">
                            <SlidersIcon className="w-24 h-24 text-foreground-light dark:text-foreground-dark opacity-80" />
                        </div>
                    </div>
                    <div className="step-text md:pl-8 text-left md:text-right relative pt-12">
                        <div className="step-number text-[10rem] font-black text-foreground-light/10 dark:text-foreground-dark/10 leading-none absolute top-0 right-0 -z-10">02</div>
                        <h3 className="text-4xl font-bold text-foreground-light dark:text-foreground-dark drop-shadow-md mb-4">{t('step2Title')}</h3>
                        <p className="text-lg text-foreground-light/80 dark:text-foreground-dark/80">{t('step2Desc')}</p>
                    </div>
                </div>
                
                {/* Step 3 */}
                <div className="how-it-works-step grid md:grid-cols-2 gap-12 items-center">
                    <div className="step-text md:pr-8 relative pt-12">
                        <div className="step-number text-[10rem] font-black text-foreground-light/10 dark:text-foreground-dark/10 leading-none absolute top-0 left-0 -z-10">03</div>
                        <h3 className="text-4xl font-bold text-foreground-light dark:text-foreground-dark drop-shadow-md mb-4">{t('step3Title')}</h3>
                        <p className="text-lg text-foreground-light/80 dark:text-foreground-dark/80">{t('step3Desc')}</p>
                    </div>
                    <div className="step-visual flex justify-center">
                        <div className="p-8 rounded-[2rem] glass-card w-full max-w-md aspect-video flex items-center justify-center">
                            <DownloadIcon className="w-24 h-24 text-foreground-light dark:text-foreground-dark opacity-80" />
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
      </section>
      

    </div>
  );
};

export default LandingPage;