import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user'
import { t } from 'logseq-l10n'
import { language } from './language'

/* user setting */
// https://logseq.github.io/plugins/types/SettingSchemaDesc.html
export const settingsTemplate = (): SettingSchemaDesc[] => [
  {
    key: "userLanguage",
    title: t("Select language (default)"),
    type: "enum",
    default: "default",
    enumChoices: language,
    // defaultを選択すると、ブラウザの言語設定に従う(ローカライズ)
    description: t("If default is selected, the browser's language settings are followed (localisation)."),
  },

  {
    //loadPageInfo
    key: "headingLoadPageInfoButton",
    title: t("Page Info Button feature"),
    type: "heading",
    default: "",
    //ページ名の横にある📋アイコンをクリックしたときに表示されるページ情報を表示する
    //日付はre-indexを実行すると更新される
    description: t("Show the page info when click 📋 icon on the right of page title."),
  },
  {
    //loadPageInfo
    key: "loadPageInfoButton",
    title: t("Enable"),
    type: "boolean",
    default: false,
    description: "",
  },

  {
    //loadPageDateNotifier
    key: "headingLoadPageDateNotifier",
    title: t("Page Date Notifier feature"),
    type: "heading",
    default: "",
    description: t("Show the date when a page opens"),
  },
  {
    //loadPageDateNotifier
    key: "loadPageDateNotifier",
    title: t("Enable"),
    type: "boolean",
    default: true,
    description: "",
  },
]
