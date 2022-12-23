export default defineAppConfig({
  pages: ['pages/index/index'],
  subPackages: [
    {
      root: 'pages/dictionary',
      pages: ['index'],
    },
    {
      root: 'pages/solitaire',
      pages: ['index'],
    },
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black',
  },
  lazyCodeLoading: 'requiredComponents',
});
