import '@logseq/libs' //https://plugins-doc.logseq.com/
import { settingsTemplate } from './settings'
import { setup as l10nSetup, t } from "logseq-l10n" //https://github.com/sethyuan/logseq-l10n
import ja from "./translations/ja.json"
import { loadPageInfoButton } from "./pageInfoButton"
import { loadPageDateNotifier } from "./pageDateNotifier"
import { LSPluginBaseInfo } from '@logseq/libs/dist/LSPlugin'

/* main */
const main = async () => {

  await l10nSetup({ builtinTranslations: { ja } })

  /* user settings */
  logseq.useSettingsSchema(settingsTemplate())
  if (!logseq.settings) setTimeout(() => logseq.showSettingsUI(), 300)


  logseq.provideStyle(String.raw`
    [data-id="logseq-plugin-show-page-date"] {
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
        & div.desc-item p {
          margin-top: 0.5em;
          margin-bottom: 0.5em;
        }
    }
    #main-content-container {
        & #injected-ui-item-pageInfoBarSpace-show-page-date.injected-ui-item-pagebar {
          order:-1;
        }
        & #pageBar--pageInfoBarSpace {
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
        & div.list-wrap:has(div#pageBar--pageInfoBarSpace) {
          padding-top:unset;
          overflow:hidden;
          height:100px;
        }
        & [data-type="pagebar"] div.list-wrap:has(div#pageBar--pageInfoBarSpace) {
        overflow:hidden;
        }
      }
    }
`)

  //初回起動時
  loadPageDateNotifier()
  if (logseq.settings!.loadPageInfoButton === true) loadPageInfoButton()

  //設定変更時
  logseq.onSettingsChanged(async (newSet: LSPluginBaseInfo['settings'], oldSet: LSPluginBaseInfo['settings']) => {
    if (oldSet.loadPageDateNotifier === false
      && newSet.loadPageDateNotifier === true) {
      //オン
      loadPageDateNotifier()
      logseq.UI.showMsg(t("This setting will not be reflected on this page."), "warning")
    } else
      if (oldSet.loadPageDateNotifier === true
        && newSet.loadPageDateNotifier === false) {
        //オフ
        removeClass('show-page-date-notifier')
        removeInnerElementId('pageBar--pageInfoBarSpace')
      }

    if (oldSet.loadPageInfoButton === false
      && newSet.loadPageInfoButton === true) {
      //オン
      if (!document.body.classList.contains("show-page-info-button")) loadPageInfoButton()
    } else
      if (oldSet.loadPageInfoButton === true
        && newSet.loadPageInfoButton === false) {
        //オフ
        removeClass('show-page-info-button')
        logseq.App.registerUIItem("pagebar", {
          key: "pageInfo",
          template: "",
        })
      }
  })

}/* end_main */


const removeClass = (className: string) => {
  if (document.body.classList.contains(className)) document.body.classList.remove(className)
}

const removeInnerElementId = (elementId: string) => {
  const doc = parent.document.getElementById(elementId) as HTMLElement | null //parent.documentはiframeの親要素
  if (doc) doc.innerHTML = ""
}


logseq.ready(main).catch(console.error)