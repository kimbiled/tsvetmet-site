import { theme, type ThemeConfig } from 'antd'

const font = "'Inter Variable', ui-sans-serif, system-ui, -apple-system, sans-serif"

/** Светлая тема antd: Inter, чёрные кнопки, оранжевый фокус, тонкие рамки. */
export const antdTheme: ThemeConfig = {
  token: {
    fontFamily: font,
    fontSize: 15,
    fontSizeLG: 16, // 16px в полях — iOS не зумит страницу при фокусе
    colorPrimary: '#171717',
    colorText: '#171717',
    colorTextSecondary: '#525252',
    colorTextPlaceholder: '#a3a3a3',
    colorBorder: 'rgba(0, 0, 0, 0.12)',
    colorError: '#c2410c',
    borderRadius: 10,
    borderRadiusLG: 12,
    controlHeightLG: 48,
    motionEaseOut: 'cubic-bezier(0.23, 1, 0.32, 1)',
    motionDurationMid: '0.2s',
  },
  components: {
    Input: {
      activeBorderColor: '#e0773a',
      hoverBorderColor: 'rgba(0, 0, 0, 0.24)',
      activeShadow: '0 0 0 3px rgba(224, 119, 58, 0.18)',
    },
    Segmented: {
      trackBg: '#ececec',
      itemColor: '#525252',
      itemHoverColor: '#171717',
      itemSelectedColor: '#171717',
      trackPadding: 3,
      fontSizeLG: 15,
      controlHeightLG: 40,
    },
    Button: {
      fontWeight: 500,
      primaryShadow: 'none',
      defaultShadow: 'none',
    },
    Tooltip: {
      colorBgSpotlight: '#171717',
    },
  },
}

/** Тёмная тема для блока заявки: оранжевая кнопка с тёмным текстом. */
export const antdDarkTheme: ThemeConfig = {
  // Не наследовать светлую тему родителя: иначе её colorText (#171717) делает ввод чёрным на тёмном фоне
  inherit: false,
  algorithm: theme.darkAlgorithm,
  token: {
    fontFamily: font,
    fontSize: 15,
    fontSizeLG: 16,
    colorText: 'rgba(255, 255, 255, 0.92)',
    colorTextPlaceholder: '#8a8a8a',
    colorPrimary: '#e0773a',
    colorTextLightSolid: '#171717',
    colorBgContainer: '#1f1f1f',
    colorBorder: 'rgba(255, 255, 255, 0.12)',
    colorError: '#f0a274',
    borderRadius: 10,
    controlHeightLG: 48,
  },
  components: {
    Input: {
      activeBorderColor: '#e0773a',
      hoverBorderColor: 'rgba(255, 255, 255, 0.28)',
      activeShadow: '0 0 0 3px rgba(224, 119, 58, 0.25)',
    },
    Button: { fontWeight: 600, primaryShadow: 'none' },
    Form: { labelColor: '#e5e5e5' },
  },
}
