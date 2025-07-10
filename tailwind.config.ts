import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/ui/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // safelist: [
  //   ...flatMap(['', 'sm:', 'md:', 'lg:', 'xl:', '2xl:'], (prefix) =>
  //     Array.from({ length: 24 }, (_, i) => [
  //       `${prefix}w-${i + 1}-24`,
  //       `${prefix}w-col-${i + 1}`,
  //       `${prefix}ms-${i + 1}-24`,
  //       `${prefix}order-${i + 1}-24`,
  //     ]).flat(),
  //   ),
  //   ...flatMap(['', 'sm:', 'md:', 'lg:', 'xl:', '2xl:'], (prefix) =>
  //     Array.from({ length: 100 }, (_, i) => [
  //       `${prefix}gap-y-dynamic-${i + 1}`,
  //       `${prefix}px-dynamic-${i + 1}`,
  //       `${prefix}-mx-dynamic-${i + 1}`,
  //     ]).flat(),
  //   ),
  //   ...flatMap(['sm:', 'md:', 'lg:', 'xl:', '2xl:'], (prefix) => [
  //     ...flatMap(['start', 'center', 'end', 'stretch'], (value) => [
  //       `${prefix}items-${value}`,
  //     ]),
  //     ...flatMap(
  //       [
  //         'start',
  //         'end',
  //         'center',
  //         'space-around',
  //         'space-between',
  //         'space-evenly',
  //       ],
  //       (value) => [
  //         `${prefix}justify-${
  //           (value === 'space-around' && 'around') ||
  //           (value === 'space-between' && 'between') ||
  //           (value === 'space-evenly' && 'evenly') ||
  //           value
  //         }`,
  //       ],
  //     ),
  //   ]),
  // ],
  theme: {
    container: {
      center: true,
      screens: {
        '2xl': '1352px',
      },
      padding: '16px',
    },
    extend: {
      fontFamily: {
        spartan: ['var(--font-league-spartan)'],
      },
      width: Object.fromEntries([
        ...Array.from({ length: 24 }, (_, i) => [
          `${i + 1}-24`,
          `${((i + 1) / 24) * 100}%`,
        ]),
        ...Array.from({ length: 24 }, (_, i) => [
          `col-${i + 1}`,
          `${100 / (i + 1)}%`,
        ]),
      ]),
      order: Object.fromEntries(
        Array.from({ length: 12 }, (_, i) => [`${i + 13}`, `${i + 13}`]),
      ),
      margin: Object.fromEntries(
        Array.from({ length: 24 }, (_, i) => [
          `${i + 1}-24`,
          `${((i + 1) / 24) * 100}%`,
        ]),
      ),
      spacing: ({ theme }) => {
        const maxSpacing = theme('maxSpacing', 100)
        const spacingFactor = theme('spacingFactor', 1)

        let spacingValues: Record<string, string> = {}

        for (let i = 1; i <= maxSpacing; i++) {
          spacingValues[`dynamic-${i}`] = `${i * spacingFactor}px`
        }

        return spacingValues
      },
      gap: ({ theme }) => {
        const maxSpacing = theme('maxSpacing', 100)
        const spacingFactor = theme('spacingFactor', 1)

        let spacingValues: Record<string, string> = {}

        for (let i = 1; i <= maxSpacing; i++) {
          spacingValues[`dynamic-${i}`] = `${i * spacingFactor}px`
        }

        return spacingValues
      },
    },
    animation: {
      'slide-left-right': 'slide-left-right 1s ease-in-out infinite',
    },
    keyframes: {
      'slide-left-right': {
        '0%': { transform: 'translateX(-1px)' },
        '50%': { transform: 'translateX(1px)' },
        '100%': { transform: 'translateX(-1px)' },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
export default config
