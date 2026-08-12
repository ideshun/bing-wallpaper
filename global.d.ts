/**
 * 全局类型声明（CSS 等非 TS 资源）
 */

/** 支持 `import '../styles/index.css'` 等副作用导入 */
declare module '*.css'

declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}
