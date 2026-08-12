import * as OpenCC from 'opencc-js'

const toTaiwan = OpenCC.Converter({ from: 'cn', to: 'tw' })

/**
 * 简体中文转台湾繁体
 * @param text - 简体文本
 */
export function toTraditionalZh(text: string): string {
  if (!text) return text
  return toTaiwan(text)
}
