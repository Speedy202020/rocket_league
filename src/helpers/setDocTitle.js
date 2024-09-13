import { i18nGlobal } from "@/plugins"

export function setDocTitle(page) {
  if (page.name == 'Not Found') {
    document.title = "VDL - 404"
    return
  }

  if (!page || page.name == 'Home') {
    document.title = "VDL"
    return
  }

  if (page.name == 'Project') {
    page = page.name.toLowerCase()
  } else {
    page = page.path.slice(1)
  }

  document.title = "VDL - " + i18nGlobal.t('pages.' + page + '.page')
}
