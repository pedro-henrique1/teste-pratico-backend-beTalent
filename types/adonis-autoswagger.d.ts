declare module 'adonis-autoswagger' {
  const AutoSwagger: {
    default: {
      docs: (router: any, config: any) => any
      ui: (url: string, config: any) => any
    }
  }
  export default AutoSwagger
}
