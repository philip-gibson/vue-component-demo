import { definePreset } from '@primeuix/themes'
import Aura from '@primeuix/themes/aura'
import PrimeVue from 'primevue/config'
import DialogService from 'primevue/dialogservice'
import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'
import type { App } from 'vue'

const upMetricsPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: 'light-dark({orange.50}, {indigo.50})',
      100: 'light-dark({orange.100}, {indigo.100})',
      200: 'light-dark({orange.200}, {indigo.200})',
      300: 'light-dark({orange.300}, {indigo.300})',
      400: 'light-dark({orange.400}, {indigo.400})',
      500: 'light-dark({orange.500}, {indigo.500})',
      600: 'light-dark({orange.600}, {indigo.600})',
      700: 'light-dark({orange.700}, {indigo.700})',
      800: 'light-dark({orange.800}, {indigo.800})',
      900: 'light-dark({orange.900}, {indigo.900})',
      950: 'light-dark({orange.950}, {indigo.950})'
    },
    surface: {
        0: '#ffffff',
        50: 'light-dark({stone.50}, {zinc.50})',
        100: 'light-dark({stone.100}, {zinc.100})',
        200: 'light-dark({stone.200}, {zinc.200})',
        300: 'light-dark({stone.300}, {zinc.300})',
        400: 'light-dark({stone.400}, {zinc.400})',
        500: 'light-dark({stone.500}, {zinc.500})',
        600: 'light-dark({stone.600}, {zinc.600})',
        700: 'light-dark({stone.700}, {zinc.700})',
        800: 'light-dark({stone.800}, {zinc.800})',
        900: 'light-dark({stone.900}, {zinc.900})',
        950: 'light-dark({stone.950}, {zinc.950})'
    }
  },
  components: {
    /**
     * Override component styles here.  Get object structure from presets e.g.
     * https://github.com/primefaces/primeuix/blob/main/packages/themes/src/presets/aura/button/index.ts */
    button: {
      colorScheme: {
        light: {
          outlined: {
            primary: {
              hoverBackground: '{primary.200}',
              activeBackground: '{primary.50}',
              borderColor: '{primary.500}',
              color: '{primary.500}',
            },
          },
        },
      },
    },
    dialog: {
      content: {
        padding: '0 1.25rem 0 1.25rem',
      },
      footer: {
        padding: '1.25rem 1.25rem 1.25rem 1.25rem',
      },
    },
    multiselect: {
      list: {
        header: {
          padding: '0.75rem 1rem 0.25rem 1rem',
        },
      },
    },
    tag: {
      root: {
        fontSize: '12.5px',
      },
      colorScheme: {
        light: {
          primary: {
            background: '{primary.50}',
          },
        },
      },
    },
  },
})

export const installPrimeVue = (app: App) => {
  app
    .use(PrimeVue, {
      theme: {
        preset: upMetricsPreset,
        options: {
          darkModeSelector: '.dark',
        },
      },
      license: import.meta.env.VITE_PRIMEUI_LICENSE_KEY,
    })
    .use(ToastService)
    .use(DialogService)
  app.directive('tooltip', Tooltip)
}
