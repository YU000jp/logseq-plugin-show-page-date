import { PageEntity } from "@logseq/libs/dist/LSPlugin.user"
import { t } from "logseq-l10n"
import { getCurrentPageUpdateAt } from "./query/advancedQuery"

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
  const updateAt = await getCurrentPageUpdateAt() as PageEntity["updatedAt"] | null
  if (!updateAt) return

  const updated: Date = new Date(updateAt as number)
  const updatedString = logseq.settings!.userLanguage === "default" ?
    dateFormatter.format(updated) + " " + timeFormatter.format(updated)
    : dateFormatterUser(logseq.settings!.userLanguage).format(updated) + " " + timeFormatterUser(logseq.settings!.userLanguage).format(updated)
  elementPageBarSpace.innerHTML = `
  <table>${updatedString
      ? `<tr><th>${t("Last modified")}</th><td>` +
      updatedString +
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

export const dateFormatterUser = (locales: string) => new Intl.DateTimeFormat(locales, {
  year: "numeric",
  month: "long",
  day: "numeric",
})

export const timeFormatter = new Intl.DateTimeFormat("default", {
  hour: "numeric",
  minute: "numeric",
})

export const timeFormatterUser = (locales: string) => new Intl.DateTimeFormat(locales, {
  hour: "numeric",
  minute: "numeric",
})