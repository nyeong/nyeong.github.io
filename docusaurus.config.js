// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');
const math = require('remark-math');
const katex = require('rehype-katex');
const now = (function() {
  const now = new Date(Date.now());
  const year = now.getFullYear().toString().slice(2);
  const month = now.getMonth() + 1;
  const date = now.getDate();
  
  return `${year}년 ${month}월 ${date}일`
})();

async function createConfig() {
  const smartypants = (await import('remark-smartypants')).default;
  /** @type {import('@docusaurus/types').Config} */
  return {
    title: '하나씩',
    tagline: '배운 것들을 하나씩 정리합니다',
    staticDirectories: ['public', 'static'],
    url: 'https://annyeong.me',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    organizationName: 'nyeong',
    projectName: 'hanassig',
    i18n: {
      defaultLocale: 'ko-Kr',
      locales: ['ko-Kr'],
    },
  
    stylesheets: [
      {
        href: '/katex/katex.min.css',
        type: 'text/css',
      },
    ],

    presets: [
      [
        'classic',
        /** @type {import('@docusaurus/preset-classic').Options} */
        ({
          docs: {
            sidebarPath: require.resolve('./sidebars.js'),
            editUrl:
              'https://github.com/nyeong/hanassig/edit/main',
            path: 'notes',
            routeBasePath: 'notes',
            remarkPlugins: [smartypants, math],
            rehypePlugins: [katex],
          },
          blog: {
            showReadingTime: true,
            editUrl: 'https://github.com/nyeong/hanassig/edit/main',
            remarkPlugins: [smartypants, math],
            rehypePlugins: [katex],
          },
          theme: {
            customCss: require.resolve('./src/css/custom.css'),
          },
        }),
      ],
    ],

    themeConfig:
      /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
      ({
        navbar: {
          title: '하나씩',
          logo: {
            alt: '로고',
            src: 'img/hanassig_rect.png',
          },
          items: [
            {
              type: 'doc',
              docId: 'README',
              position: 'left',
              label: '노트',
            },
            {to: '/blog', label: '블로그', position: 'left'},
            {
              href: 'https://github.com/nyeong/hanassig',
              label: 'GitHub',
              position: 'right',
            },
          ],
        },
        footer: {
          copyright: `Copyright © ${new Date().getFullYear()} An Nyeong. ${now}에 업데이트됨.`,
        },
        prism: {
          theme: lightCodeTheme,
          darkTheme: darkCodeTheme,
          additionalLanguages: ['elixir', 'ruby', 'haskell', 'rust', 'java']
        },
      }),
  };
};

module.exports = createConfig;
