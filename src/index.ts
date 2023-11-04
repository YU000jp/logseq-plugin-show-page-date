import '@logseq/libs' //https://plugins-doc.logseq.com/
import { settingsTemplate } from './settings'
import { setup as l10nSetup, t } from "logseq-l10n" //https://github.com/sethyuan/logseq-l10n
import ja from "./translations/ja.json"
import { loadPageInfoButton } from "./pageInfoButton"
import { loadPageDateNotifier } from "./pageDateNotifier"

/* main */
const main = async () => {

  await l10nSetup({ builtinTranslations: { ja } })

  /* user settings */
  logseq.useSettingsSchema(settingsTemplate())
  if (!logseq.settings) setTimeout(() => logseq.showSettingsUI(), 300)


  logseq.provideStyle(String.raw`
  body>div#root>div>main {
    & article>div[data-id="show-page-date"] {
        & div.heading-item {
          margin-top: 3em;
          border-top-width: 1px;
          border-bottom-width: 0;
          padding-top: 1em;
          &>h2 {
            margin-bottom: 0.5em;
          }
        }
        & textarea.form-input {
          height: 12em;
          font-size: unset;
        }
        & div.desc-item {
          & p {
              margin-top: 0.5em;
              margin-bottom: 0.5em;
          }
        }
    }
    & div#main-content-container div {
        &#injected-ui-item-pageInfoBarSpace-show-page-date.injected-ui-item-pagebar {
          order:-1;
        }
        &#pageBar--pageInfoBarSpace {
          height: 80px;
          user-select: none;
          overflow: auto;
          & table {
            width: fit-content;
            overflow: auto;
            &>tbody>tr {
              &>th,
              &>td {
                font-size:.8em;
                padding: unset;
                padding-left: .8em;
                width: fit-content;
              }
            }
          }
        }
        &.list-wrap:has(div#pageBar--pageInfoBarSpace) {
          padding-top:unset;
          overflow:hidden;
          height:100px;
        }
        &[data-type="pagebar"] div.list-wrap:has(div#pageBar--pageInfoBarSpace) {
        overflow:hidden;
        }
      }
    }
  }
`)

  //Page bar item
  //ページ情報を表示する
  if (logseq.settings!.loadPageInfoButton === true) loadPageInfoButton()

  //Page date notifier
  if (logseq.settings!.loadPageDateNotifier === true) loadPageDateNotifier()

}/* end_main */



logseq.ready(main).catch(console.error)