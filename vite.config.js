import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        'piattaforme-autocarrate': './piattaforme-autocarrate.html',
        'pantografi-elettrici': './pantografi-elettrici.html',
        'semoventi-telescopici': './semoventi-telescopici.html',
        'piattaforme-ragno': './piattaforme-ragno.html',
        'semoventi-articolati': './semoventi-articolati.html',
        'escavatori': './escavatori.html',
      }
    }
  },
  server: {
    fs: {
      strict: false
    }
  }
})








