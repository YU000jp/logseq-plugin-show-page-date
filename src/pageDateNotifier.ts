import { PageEntity } from "@logseq/libs/dist/LSPlugin.user"
import { isSameDay } from "date-fns"
import { t } from "logseq-l10n"

export const loadPageDateNotifier = () => {

  document.body.classList.add('show-page-date-notifier')

  //ページを開いたときに、ページの作成日時、更新日時を表示する
  logseq.App.registerUIItem("pagebar", {
    key: "pageInfoBarSpace",
    template: `
        <div id="pageBar--pageInfoBarSpace" title=""></div>
        `,
  })

  if (logseq.settings!.loadPageDateNotifier === true)
    document.body.classList.add('show-page-date-notifier')

  let processing = false
  const event = () => setTimeout(() => {
    if (processing) return
    processing = true
    insertPageBar()
    setTimeout(() => processing = false, 100)
  }, 50)

  logseq.App.onPageHeadActionsSlotted(async () => event())
  logseq.App.onRouteChanged(async () => event())
}


const insertPageBar = async () => {
  if (logseq.settings!.loadPageDateNotifier === false
    || document.body.classList.contains('show-page-date-notifier') === false)
    return

  const elementPageBarSpace = parent.document.getElementById(
    "pageBar--pageInfoBarSpace"
  ) as HTMLDivElement | null
  if (!elementPageBarSpace) return
  if (elementPageBarSpace.dataset.pageInfoCheck) return
  const current = (await logseq.Editor.getCurrentPage() as PageEntity | null) as { createdAt: number, updatedAt: number } | null
  if (!current) return
  if (!current.updatedAt
    && !current.createdAt) return


  const updated: Date = new Date(current.updatedAt as number)
  //updatedをフォーマットする(最後の3文字を削除する)
  const updatedString = dateFormatter.format(updated) + " " + timeFormatter.format(updated)
  const created: Date = new Date(current.createdAt as number)
  //createdをフォーマットする
  const createdString = dateFormatter.format(created) + " " + timeFormatter.format(created)
  elementPageBarSpace.innerHTML = `
  <table>${updatedString
      ? `<tr><th>${t("Last modified")}</th><td>` +
      updatedString +
      "</td></tr>"
      : ""
    }${logseq.settings!.pageDateNotifierCreatedAt === true // 設定で作成日時を表示するかどうかを判定
      //&& !isSameDay(updated, created) // updatedとcreatedが同じ日付の場合は、createdを表示しない
      && createdString // createdがある場合のみ表示
      ? `<tr><th>${t("Created-at")}</th><td>` +
      createdString +
      "</td></tr>"
      : ""
    }</table>
    `
  elementPageBarSpace.dataset.pageInfoCheck = "true"
}

// Intl.DateTimeFormatオブジェクトを作成（デフォルトロケールを使用）
export const dateFormatter = new Intl.DateTimeFormat("default", {
  year: "numeric",
  month: "long",
  day: "numeric",
})

export const timeFormatter = new Intl.DateTimeFormat("default", {
  hour: "numeric",
  minute: "numeric",
})
