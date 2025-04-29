import { PageEntity } from "@logseq/libs/dist/LSPlugin"
import { dateFormatter, timeFormatter } from "./pageDateNotifier"
import { t } from "logseq-l10n"
import { getCurrentPageUpdateAt } from "./query/advancedQuery"

//Page info button
export const loadPageInfoButton = () => {

  document.body.classList.add('show-page-date-button-info')

  logseq.App.registerUIItem("pagebar", {
    key: "pageInfo",
    template: `
    <div id="pageBar--pageInfoButton" data-on-click="modelPageInfo" title="${t("Page info")}"><a class="button icon">📑</a></div>
    `,
  })
  logseq.provideModel({
    modelPageInfo: async () => {

      const updateAt = await getCurrentPageUpdateAt() as PageEntity["updatedAt"] | null
      if (updateAt) {
        const updatedAt = new Date(updateAt as number)
        const updatedAtStr =
          dateFormatter.format(updatedAt) +
          " " +
          timeFormatter.format(updatedAt)
        
        logseq.UI.showMsg(
          `--- ${t("Page info")} ---

        ${t("Last modified")}:
        ${updatedAtStr}

        `,
          "info",
          { timeout: 1000 * 60 }
        )

      } else
        logseq.UI.showMsg("Not found", "error", { timeout: 1200 })
    },
  })
}
