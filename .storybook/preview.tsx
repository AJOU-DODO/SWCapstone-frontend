import type { Preview } from '@storybook/nextjs-vite'
import { initialize, mswLoader } from 'msw-storybook-addon';
import api from '../src/lib/axios'; 

// @ts-expect-error 라이브러리 타입 미지원
import "@/app/globals.css";

initialize();
api.defaults.baseURL = '';
api.defaults.adapter = 'fetch';

const preview: Preview = {
  loaders: [mswLoader],
  parameters: {
    controls: {
      matchers: {
       color: /(background|color)$/i,
       date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo'
    }
  },
};

export default preview;